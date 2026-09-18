'use client'

import { useEffect, useState } from 'react'
import { listCoupons, createCoupon, updateCoupon, deleteCoupon } from '@/lib/adminApi'
import { PageHeader, StatusBadge, Spinner, ErrorNotice, EmptyState } from '@/components/ui'
import Modal from '@/components/Modal'

const SERVICE_TYPES = ['flight', 'hotel', 'bus', 'train', 'package']

const EMPTY_FORM = {
  code: '',
  discountType: 'percentage',
  discountValue: '',
  minOrderPaise: '0',
  maxDiscountPaise: '',
  validUntil: '',
  applicableOn: [],
}

export default function CouponsPage() {
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
      const result = await listCoupons()
      setRows(result.data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  function openCreate() {
    setEditing(null)
    setForm(EMPTY_FORM)
    setFormError('')
    setModalOpen(true)
  }

  function openEdit(coupon) {
    setEditing(coupon)
    setForm({
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: String(coupon.discountValue),
      minOrderPaise: String(coupon.minOrderPaise),
      maxDiscountPaise: String(coupon.maxDiscountPaise),
      validUntil: coupon.validUntil,
      applicableOn: coupon.applicableOn || [],
    })
    setFormError('')
    setModalOpen(true)
  }

  function toggleService(service) {
    setForm((prev) => ({
      ...prev,
      applicableOn: prev.applicableOn.includes(service)
        ? prev.applicableOn.filter((item) => item !== service)
        : [...prev.applicableOn, service],
    }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setSaving(true)
    setFormError('')
    const payload = {
      code: form.code.trim(),
      discountType: form.discountType,
      discountValue: Number(form.discountValue),
      minOrderPaise: Number(form.minOrderPaise) || 0,
      maxDiscountPaise: Number(form.maxDiscountPaise),
      validUntil: form.validUntil,
      applicableOn: form.applicableOn,
    }
    try {
      if (editing) await updateCoupon(editing.id, payload)
      else await createCoupon(payload)
      setModalOpen(false)
      load()
    } catch (err) {
      setFormError(err.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleToggleActive(coupon) {
    try {
      await updateCoupon(coupon.id, { active: !coupon.active })
      load()
    } catch (err) {
      setError(err.message)
    }
  }

  async function handleDelete(coupon) {
    if (!window.confirm(`Delete coupon ${coupon.code}? This cannot be undone.`)) return
    try {
      await deleteCoupon(coupon.id)
      load()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div>
      <PageHeader
        title="Coupons"
        description="Discount codes customers can apply at checkout."
        action={<button className="btn-primary" onClick={openCreate}>New coupon</button>}
      />

      <div className="panel">
        {error ? <ErrorNotice message={error} onRetry={load} /> : loading ? <Spinner /> : rows.length === 0 ? (
          <EmptyState title="No coupons yet" description="Create your first discount code to get started." />
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Discount</th>
                <th>Min. order</th>
                <th>Applies to</th>
                <th>Valid until</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((coupon) => (
                <tr key={coupon.id}>
                  <td className="font-mono text-xs font-medium text-ink">{coupon.code}</td>
                  <td>{coupon.discountType === 'percentage' ? `${coupon.discountValue}%` : `₹${coupon.discountValue}`}</td>
                  <td>₹{(coupon.minOrderPaise / 100).toLocaleString('en-IN')}</td>
                  <td className="capitalize">{(coupon.applicableOn || []).join(', ') || 'All services'}</td>
                  <td>{coupon.validUntil}</td>
                  <td><StatusBadge status={coupon.active ? 'active' : 'inactive'} /></td>
                  <td className="whitespace-nowrap text-right">
                    <button className="mr-3 text-sm font-medium text-ink-soft hover:text-ink" onClick={() => openEdit(coupon)}>Edit</button>
                    <button className="mr-3 text-sm font-medium text-ink-soft hover:text-ink" onClick={() => handleToggleActive(coupon)}>
                      {coupon.active ? 'Deactivate' : 'Activate'}
                    </button>
                    <button className="text-sm font-medium text-cherry hover:text-cherry/80" onClick={() => handleDelete(coupon)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modalOpen ? (
        <Modal title={editing ? 'Edit coupon' : 'New coupon'} onClose={() => setModalOpen(false)}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="field-label">Code</label>
              <input
                className="field-input font-mono"
                required
                disabled={!!editing}
                value={form.code}
                onChange={(event) => setForm({ ...form, code: event.target.value.toUpperCase() })}
                placeholder="LEMON20"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="field-label">Discount type</label>
                <select
                  className="field-input"
                  value={form.discountType}
                  onChange={(event) => setForm({ ...form, discountType: event.target.value })}
                >
                  <option value="percentage">Percentage</option>
                  <option value="flat">Flat amount (₹)</option>
                </select>
              </div>
              <div>
                <label className="field-label">{form.discountType === 'percentage' ? 'Percentage off' : 'Amount off (₹)'}</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  className="field-input"
                  value={form.discountValue}
                  onChange={(event) => setForm({ ...form, discountValue: event.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="field-label">Minimum order (₹)</label>
                <input
                  type="number"
                  min="0"
                  className="field-input"
                  value={Number(form.minOrderPaise) / 100 || 0}
                  onChange={(event) => setForm({ ...form, minOrderPaise: String(Number(event.target.value) * 100) })}
                />
              </div>
              <div>
                <label className="field-label">Max discount cap (₹)</label>
                <input
                  type="number"
                  min="0"
                  required
                  className="field-input"
                  value={Number(form.maxDiscountPaise) / 100 || ''}
                  onChange={(event) => setForm({ ...form, maxDiscountPaise: String(Number(event.target.value) * 100) })}
                />
              </div>
            </div>

            <div>
              <label className="field-label">Valid until</label>
              <input
                type="date"
                required
                className="field-input"
                value={form.validUntil}
                onChange={(event) => setForm({ ...form, validUntil: event.target.value })}
              />
            </div>

            <div>
              <label className="field-label">Applies to (leave blank for all services)</label>
              <div className="flex flex-wrap gap-2">
                {SERVICE_TYPES.map((service) => (
                  <button
                    type="button"
                    key={service}
                    onClick={() => toggleService(service)}
                    className={`badge capitalize ${form.applicableOn.includes(service) ? 'bg-citrus/30 border-citrus-dim text-ink' : 'bg-transparent border-line text-ink-soft'}`}
                  >
                    {service}
                  </button>
                ))}
              </div>
            </div>

            {formError ? <p className="text-sm text-cherry">{formError}</p> : null}

            <div className="flex justify-end gap-2 pt-2">
              <button type="button" className="btn-ghost" onClick={() => setModalOpen(false)}>Cancel</button>
              <button type="submit" disabled={saving} className="btn-primary">{saving ? 'Saving…' : 'Save coupon'}</button>
            </div>
          </form>
        </Modal>
      ) : null}
    </div>
  )
}
