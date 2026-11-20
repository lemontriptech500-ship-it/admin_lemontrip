'use client'

import { useEffect, useState } from 'react'
import { listBlogPosts, createBlogPost, updateBlogPost, deleteBlogPost } from '@/lib/adminApi'
import { PageHeader, Spinner, ErrorNotice, EmptyState } from '@/components/ui'
import Modal from '@/components/Modal'

const EMPTY_FORM = {
  category: '',
  title: '',
  excerpt: '',
  content: '',
  imageUrl: '',
  publishedAt: new Date().toISOString().slice(0, 10),
  publicationStatus: 'published',
  readTime: '5 min read',
}

export default function BlogPage() {
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
      const result = await listBlogPosts()
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

  function openEdit(post) {
    setEditing(post)
    setForm({
      category: post.category,
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      imageUrl: post.imageUrl || '',
      publishedAt: post.publishedAt,
      publicationStatus: post.publicationStatus || 'published',
      readTime: post.readTime || '5 min read',
    })
    setFormError('')
    setModalOpen(true)
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setSaving(true)
    setFormError('')
    try {
      if (editing) await updateBlogPost(editing.id, form)
      else await createBlogPost(form)
      setModalOpen(false)
      load()
    } catch (err) {
      setFormError(err.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(post) {
    if (!window.confirm(`Delete "${post.title}"? This cannot be undone.`)) return
    try {
      await deleteBlogPost(post.id)
      load()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div>
      <PageHeader
        title="Blog"
        description="Articles shown on the public LemonTrip site."
        action={<button className="btn-primary" onClick={openCreate}>New post</button>}
      />

      <div className="panel">
        {error ? <ErrorNotice message={error} onRetry={load} /> : loading ? <Spinner /> : rows.length === 0 ? (
          <EmptyState title="No posts yet" description="Publish your first article." />
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Published</th>
                <th>Status</th>
                <th>Read time</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((post) => (
                <tr key={post.id}>
                  <td className="text-ink">{post.title}</td>
                  <td>{post.category}</td>
                  <td className="text-ink-soft">{post.publishedAt}</td>
                  <td className="text-ink-soft">{post.publicationStatus || 'published'}</td>
                  <td className="text-ink-soft">{post.readTime}</td>
                  <td className="whitespace-nowrap text-right">
                    <button className="mr-3 text-sm font-medium text-ink-soft hover:text-ink" onClick={() => openEdit(post)}>Edit</button>
                    <button className="text-sm font-medium text-cherry hover:text-cherry/80" onClick={() => handleDelete(post)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modalOpen ? (
        <Modal title={editing ? 'Edit post' : 'New post'} onClose={() => setModalOpen(false)} width="max-w-2xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="field-label">Title</label>
                <input required className="field-input" value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} />
              </div>
              <div>
                <label className="field-label">Category</label>
                <input required className="field-input" value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })} />
              </div>
            </div>

            <div>
              <label className="field-label">Excerpt</label>
              <textarea required rows={2} className="field-input" value={form.excerpt} onChange={(event) => setForm({ ...form, excerpt: event.target.value })} />
            </div>

            <div>
              <label className="field-label">Content</label>
              <textarea required rows={8} className="field-input" value={form.content} onChange={(event) => setForm({ ...form, content: event.target.value })} />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="field-label">Published date</label>
                <input type="date" required className="field-input" value={form.publishedAt} onChange={(event) => setForm({ ...form, publishedAt: event.target.value })} />
              </div>
              <div>
                <label className="field-label">Visibility</label>
                <select className="field-input" value={form.publicationStatus} onChange={(event) => setForm({ ...form, publicationStatus: event.target.value })}>
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
              <div>
                <label className="field-label">Read time</label>
                <input className="field-input" value={form.readTime} onChange={(event) => setForm({ ...form, readTime: event.target.value })} />
              </div>
              <div>
                <label className="field-label">Image URL</label>
                <input className="field-input" value={form.imageUrl} onChange={(event) => setForm({ ...form, imageUrl: event.target.value })} />
              </div>
            </div>

            {formError ? <p className="text-sm text-cherry">{formError}</p> : null}

            <div className="flex justify-end gap-2 pt-2">
              <button type="button" className="btn-ghost" onClick={() => setModalOpen(false)}>Cancel</button>
              <button type="submit" disabled={saving} className="btn-primary">{saving ? 'Saving…' : 'Save post'}</button>
            </div>
          </form>
        </Modal>
      ) : null}
    </div>
  )
}
