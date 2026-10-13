import { useCallback, useEffect, useMemo, useState } from 'react'
import { Search, Plus, Pencil, Trash2, Package, RefreshCw, X, Boxes } from 'lucide-react'
import { productApi } from './api'

const emptyForm = { name: '', sku: '', category: '', quantity: '0', price: '0.00', description: '' }
const money = (value) => new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(Number(value || 0))

export default function App() {
  const [products, setProducts] = useState([])
  const [search, setSearch] = useState('')
  const [form, setForm] = useState(emptyForm)
  const [editing, setEditing] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  const loadProducts = useCallback(async () => {
    setLoading(true); setError('')
    try {
      const result = await productApi.list(search)
      setProducts(Array.isArray(result) ? result : (result.data || []))
    } catch (e) { setError(`${e.message}. Check that Laravel is running and VITE_API_URL is correct.`) }
    finally { setLoading(false) }
  }, [search])

  useEffect(() => { loadProducts() }, [loadProducts])
  useEffect(() => { if (!notice) return; const timer = setTimeout(() => setNotice(''), 3000); return () => clearTimeout(timer) }, [notice])

  const stats = useMemo(() => ({
    products: products.length,
    units: products.reduce((sum, p) => sum + Number(p.quantity || 0), 0),
    value: products.reduce((sum, p) => sum + Number(p.quantity || 0) * Number(p.price || 0), 0),
  }), [products])

  function openCreate() { setEditing(null); setForm(emptyForm); setShowForm(true); setError('') }
  function openEdit(product) {
    setEditing(product.id)
    setForm({ name: product.name || '', sku: product.sku || '', category: product.category || '', quantity: String(product.quantity ?? 0), price: String(product.price ?? 0), description: product.description || '' })
    setShowForm(true); setError('')
  }
  async function handleSubmit(event) {
    event.preventDefault(); setSaving(true); setError('')
    const payload = { ...form, quantity: Number(form.quantity), price: Number(form.price) }
    try {
      if (editing) { await productApi.update(editing, payload); setNotice('Product updated successfully.') }
      else { await productApi.create(payload); setNotice('Product added successfully.') }
      setShowForm(false); setForm(emptyForm); setEditing(null); await loadProducts()
    } catch (e) { setError(e.message) }
    finally { setSaving(false) }
  }
  async function handleDelete(product) {
    if (!window.confirm(`Delete "${product.name}"? This cannot be undone.`)) return
    try { await productApi.remove(product.id); setNotice('Product deleted.'); await loadProducts() }
    catch (e) { setError(e.message) }
  }

  return <main className="app-shell">
    <header className="topbar"><div className="brand"><div className="brand-mark"><Boxes size={22}/></div><div><strong>Stockroom</strong><span>INVENTORY MANAGEMENT</span></div></div><div className="api-label"><span className="pulse"/> React + Laravel API</div></header>
    <section className="hero"><div><p className="eyebrow">WORKSPACE / INVENTORY</p><h1>Product inventory</h1><p className="subtitle">Keep your items organized. Create, update, search, and manage stock in one place.</p></div><button className="primary" onClick={openCreate}><Plus size={18}/> Add product</button></section>
    {notice && <div className="notice" role="status">{notice}<button onClick={() => setNotice('')} aria-label="Dismiss"><X size={16}/></button></div>}
    {error && <div className="error-banner" role="alert">{error}<button onClick={() => setError('')} aria-label="Dismiss"><X size={16}/></button></div>}
    <section className="stats">
      <article className="stat-card"><div className="stat-icon"><Package size={19}/></div><span>Total products</span><strong>{stats.products}</strong><small>Matching current search</small></article>
      <article className="stat-card"><div className="stat-icon blue"><Boxes size={19}/></div><span>Total units in stock</span><strong>{stats.units.toLocaleString()}</strong><small>Combined quantity</small></article>
      <article className="stat-card"><div className="stat-icon purple">₱</div><span>Stock value</span><strong>{money(stats.value)}</strong><small>Quantity × unit price</small></article>
    </section>
    <section className="panel">
      <div className="panel-head"><div><h2>Products</h2><p>Manage your catalog and stock levels.</p></div><button className="icon-button" onClick={loadProducts} title="Refresh" aria-label="Refresh"><RefreshCw size={17}/></button></div>
      <div className="toolbar"><label className="searchbox"><Search size={18}/><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search name, SKU, or category..." /></label><span className="result-count">{products.length} {products.length === 1 ? 'item' : 'items'}</span></div>
      <div className="table-wrap"><table><thead><tr><th>PRODUCT</th><th>SKU</th><th>CATEGORY</th><th>QTY</th><th>UNIT PRICE</th><th>STOCK VALUE</th><th>ACTIONS</th></tr></thead><tbody>
        {loading ? <tr><td colSpan="7" className="empty"><span className="spinner"/> Loading products...</td></tr> :
          products.length === 0 ? <tr><td colSpan="7" className="empty"><div className="empty-icon"><Package size={25}/></div><strong>No products found</strong><span>Add your first product or try another search.</span><button className="text-button" onClick={openCreate}>+ Add a product</button></td></tr> :
          products.map(p => <tr key={p.id}><td><div className="product-name"><div className="product-avatar">{(p.name || '?').slice(0,1).toUpperCase()}</div><div><strong>{p.name}</strong><small>{p.description || 'No description'}</small></div></div></td><td><code>{p.sku || '—'}</code></td><td><span className="category">{p.category || 'Uncategorized'}</span></td><td><span className={Number(p.quantity) <= 5 ? 'qty low' : 'qty'}>{p.quantity}</span></td><td>{money(p.price)}</td><td className="value">{money(Number(p.quantity) * Number(p.price))}</td><td><div className="actions"><button className="action edit" onClick={() => openEdit(p)} title="Edit product" aria-label={`Edit ${p.name}`}><Pencil size={16}/></button><button className="action delete" onClick={() => handleDelete(p)} title="Delete product" aria-label={`Delete ${p.name}`}><Trash2 size={16}/></button></div></td></tr>)
        }
      </tbody></table></div>
      <footer className="panel-footer"><span>Showing <strong>{products.length}</strong> products</span><span>Inventory workspace <span className="footer-dot">●</span></span></footer>
    </section>
    <p className="page-note">LAB EXAM STARTER <span>•</span> CRUD boilerplate — React frontend, Laravel REST API</p>

    {showForm && <div className="modal-backdrop" onMouseDown={e => { if (e.target === e.currentTarget) setShowForm(false) }}><section className="modal" role="dialog" aria-modal="true" aria-labelledby="form-title"><div className="modal-head"><div><p className="eyebrow">{editing ? 'EDIT RECORD' : 'NEW RECORD'}</p><h2 id="form-title">{editing ? 'Update product' : 'Add a product'}</h2></div><button className="icon-button" onClick={() => setShowForm(false)} aria-label="Close"><X size={19}/></button></div>
      <form onSubmit={handleSubmit}><div className="form-grid">
        <label className="field full">Product name *<input required maxLength="150" value={form.name} onChange={e => setForm({...form, name:e.target.value})} placeholder="e.g. Wireless mouse"/></label>
        <label className="field">SKU<input maxLength="80" value={form.sku} onChange={e => setForm({...form, sku:e.target.value})} placeholder="e.g. ACC-001"/></label>
        <label className="field">Category<input maxLength="100" value={form.category} onChange={e => setForm({...form, category:e.target.value})} placeholder="e.g. Accessories"/></label>
        <label className="field">Quantity *<input required type="number" min="0" step="1" value={form.quantity} onChange={e => setForm({...form, quantity:e.target.value})}/></label>
        <label className="field">Unit price (₱) *<input required type="number" min="0" step="0.01" value={form.price} onChange={e => setForm({...form, price:e.target.value})}/></label>
        <label className="field full">Description<textarea rows="3" maxLength="1000" value={form.description} onChange={e => setForm({...form, description:e.target.value})} placeholder="Optional details about this product"/></label>
      </div>{error && <p className="form-error">{error}</p>}<div className="modal-actions"><button type="button" className="secondary" onClick={() => setShowForm(false)}>Cancel</button><button className="primary" disabled={saving}>{saving ? 'Saving...' : editing ? 'Save changes' : 'Create product'}</button></div></form>
    </section></div>}
  </main>
}
