'use client'

import { useEffect, useState } from 'react'
import { createPackage, deletePackage, listPackages, updatePackage } from '@/lib/adminApi'
import { EmptyState, ErrorNotice, PageHeader, Spinner } from '@/components/ui'
import Modal from '@/components/Modal'

const EMPTY_FORM = {
  destination: '',
  duration: '',
  description: '',
  startingPrice: '',
  priceAmount: '',
  currency: 'INR',
  category: 'national',
  highlights: '',
  imageFallbackColor: 'bg-[var(--color-secondary-soft)]',
  imageUrl: '',
}

function formFromPackage(pkg) {
  return {
    destination: pkg.destination || '',
    duration: pkg.duration || '',
    description: pkg.description || '',
    startingPrice: pkg.startingPrice || '',
    priceAmount: String(pkg.priceAmount || ''),
    currency: pkg.currency || 'INR',
    category: pkg.category || 'national',
    highlights: (pkg.highlights || []).join('\n'),
    imageFallbackColor: pkg.imageFallbackColor || EMPTY_FORM.imageFallbackColor,
    imageUrl: pkg.imageUrl || '',
  }
}

export default function PackagesPage() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [formError, setFormError] = useState('')
  const [saving, setSaving] = useState(false)

  async function load() {
    setLoading(true)
    setError('')
    try {
      const result = await listPackages()
      setRows(result.data || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  function openCreate() {
    setEditing(null)
    setForm(EMPTY_FORM)
    setFormError('')
    setModalOpen(true)
  }

  function openEdit(pkg) {
    setEditing(pkg)
    setForm(formFromPackage(pkg))
    setFormError('')
    setModalOpen(true)
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setSaving(true)
    setFormError('')
    const payload = {
      ...form,
      destination: form.destination.trim(),
      duration: form.duration.trim(),
      description: form.description.trim(),
      startingPrice: form.startingPrice.trim(),
      priceAmount: Number(form.priceAmount),
      currency: form.currency.trim().toUpperCase(),
      highlights: form.highlights.split('\n').map((item) => item.trim()).filter(Boolean),
      imageUrl: form.imageUrl.trim(),
    }
    try {
      if (editing) await updatePackage(editing.id, payload)
      else await createPackage(payload)
      setModalOpen(false)
      await load()
    } catch (err) {
      setFormError(err.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(pkg) {
    if (!window.confirm(`Delete "${pkg.destination}"? This cannot be undone.`)) return
    try {
      await deletePackage(pkg.id)
      await load()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div>
      <PageHeader title="Tours & packages" description="Manage the travel packages shown on the public LemonTrip site." action={<button className="btn-primary" onClick={openCreate}>New package</button>} />
      <div className="panel">
        {error ? <ErrorNotice message={error} onRetry={load} /> : loading ? <Spinner /> : rows.length === 0 ? (
          <EmptyState title="No packages yet" description="Create your first tour or holiday package." />
        ) : (
          <table className="data-table">
            <thead><tr><th>Destination</th><th>Category</th><th>Duration</th><th>Price</th><th></th></tr></thead>
            <tbody>
              {rows.map((pkg) => (
                <tr key={pkg.id}>
                  <td><p className="font-medium text-ink">{pkg.destination}</p><p className="text-xs text-ink-soft">{pkg.id}</p></td>
                  <td className="capitalize">{pkg.category}</td>
                  <td>{pkg.duration}</td>
                  <td>{pkg.startingPrice}</td>
                  <td className="whitespace-nowrap text-right"><button className="mr-3 text-sm font-medium text-ink-soft hover:text-ink" onClick={() => openEdit(pkg)}>Edit</button><button className="text-sm font-medium text-cherry hover:text-cherry/80" onClick={() => handleDelete(pkg)}>Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modalOpen ? <Modal title={editing ? 'Edit package' : 'New package'} onClose={() => setModalOpen(false)} width="max-w-3xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div><label className="field-label">Destination / title</label><input required className="field-input" value={form.destination} onChange={(event) => setForm({ ...form, destination: event.target.value })} placeholder="Kerala Backwaters Escape" /></div>
            <div><label className="field-label">Category</label><select className="field-input" value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })}><option value="national">National</option><option value="international">International</option></select></div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div><label className="field-label">Duration</label><input required className="field-input" value={form.duration} onChange={(event) => setForm({ ...form, duration: event.target.value })} placeholder="5 Days, 4 Nights" /></div>
            <div><label className="field-label">Display price</label><input required className="field-input" value={form.startingPrice} onChange={(event) => setForm({ ...form, startingPrice: event.target.value })} placeholder="From INR 39,900" /></div>
            <div><label className="field-label">Booking price (INR)</label><input required type="number" min="1" step="0.01" className="field-input" value={form.priceAmount} onChange={(event) => setForm({ ...form, priceAmount: event.target.value })} placeholder="39900" /></div>
          </div>
          <div><label className="field-label">Description</label><textarea required rows={4} className="field-input" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} /></div>
          <div><label className="field-label">Highlights (one per line)</label><textarea required rows={4} className="field-input" value={form.highlights} onChange={(event) => setForm({ ...form, highlights: event.target.value })} placeholder={'Houseboat stay\nLocal food tour\nAirport transfers'} /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="field-label">Image URL</label><input type="url" className="field-input" value={form.imageUrl} onChange={(event) => setForm({ ...form, imageUrl: event.target.value })} placeholder="https://..." /></div>
            <div><label className="field-label">Fallback CSS class</label><input className="field-input" value={form.imageFallbackColor} onChange={(event) => setForm({ ...form, imageFallbackColor: event.target.value })} /></div>
          </div>
          {formError ? <p className="text-sm text-cherry">{formError}</p> : null}
          <div className="flex justify-end gap-2 pt-2"><button type="button" className="btn-ghost" onClick={() => setModalOpen(false)}>Cancel</button><button type="submit" disabled={saving} className="btn-primary">{saving ? 'Saving…' : 'Save package'}</button></div>
        </form>
      </Modal> : null}
    </div>
  )
}
