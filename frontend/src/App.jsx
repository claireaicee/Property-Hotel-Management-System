import React, { useEffect, useMemo, useState } from 'react';
import { api, API_BASE } from './api';
import { Building2, BedDouble, LayoutDashboard, Plus, Search, LogOut, Menu, X, ChevronRight, ArrowLeft, UserRound, LockKeyhole, Mail, CheckCircle2, AlertCircle, Hotel, MapPin, Wifi, Wind, Coffee, Tv, Waves, CalendarDays } from 'lucide-react';

const blank = { room_number:'', room_type:'Deluxe King', floor:'1', capacity:'2', price_per_night:'120', status:'Available', description:'', amenities:[] };
const amenityOptions = ['Wi-Fi','Air conditioning','Coffee maker','TV','Pool access'];
const money = n => new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format(Number(n||0));

function Login({ onLogin }) {
  const [email,setEmail] = useState('admin@example.com');
  const [password,setPassword] = useState('');
  const [error,setError] = useState('');
  const [busy,setBusy] = useState(false);
  async function submit(e) {
    e.preventDefault(); setError(''); setBusy(true);
    try {
      const result = await api('/login',{method:'POST',body:JSON.stringify({email,password})});
      localStorage.setItem('haven_token',result.token);
      localStorage.setItem('haven_user',JSON.stringify(result.user));
      onLogin(result.user);
    } catch (e) { setError(e.message || 'Unable to sign in. Check your email and password.'); }
    finally { setBusy(false); }
  }
  return <div className="login-page"><div className="login-art"><div className="brand light"><span className="brand-icon"><Hotel size={21}/></span><span>haven<span className="brand-dot">.</span></span></div><div className="art-copy"><span className="eyebrow">THE ART OF HOSPITALITY</span><h1>Every stay<br/>starts <em>here.</em></h1><p>A calmer way to manage your property, rooms, and the details that make every guest feel welcome.</p></div><div className="art-bottom"><span>Thoughtfully managed stays.</span><span>EST. 2026</span></div></div><div className="login-panel"><div className="login-top"><span className="mobile-brand"><Hotel size={20}/> haven.</span><span className="secure"><LockKeyhole size={13}/> SECURE ADMIN ACCESS</span></div><div className="login-form-wrap"><div className="welcome-mark"><Building2 size={22}/></div><span className="eyebrow green">WELCOME BACK</span><h2>Sign in to your<br/>workspace</h2><p className="muted">Enter your administrator credentials to continue.</p><form onSubmit={submit} className="form-stack"><label>Email address</label><div className="input-icon"><Mail size={17}/><input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="admin@hotel.com" required/></div><label>Password</label><div className="input-icon"><LockKeyhole size={17}/><input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Enter your password" required/></div>{error && <div className="inline-error" role="alert"><AlertCircle size={17}/><span>{error}</span></div>}<button className="primary-btn login-btn" disabled={busy}>{busy?'Signing in…':'Sign in'} <ChevronRight size={17}/></button></form><div className="login-hint"><LockKeyhole size={15}/><span>Administrator access only. Contact your system administrator if you need help.</span></div></div><div className="login-footer">© 2026 Haven Management <span>Private & secure</span></div></div></div>
}

function App() {
  const [user,setUser] = useState(()=>{try{return JSON.parse(localStorage.getItem('haven_user'))}catch{return null}});
  const [page,setPage] = useState('rooms');
  const [rooms,setRooms] = useState([]);
  const [selected,setSelected] = useState(null);
  const [search,setSearch] = useState('');
  const [filter,setFilter] = useState('All rooms');
  const [form,setForm] = useState(blank);
  const [notice,setNotice] = useState('');
  const [error,setError] = useState('');
  const [loading,setLoading] = useState(false);
  const [mobileNav,setMobileNav] = useState(false);
  const [saving,setSaving] = useState(false);

  async function loadRooms() {
    if (!localStorage.getItem('haven_token')) return;
    setLoading(true); setError('');
    try { const data = await api('/rooms'); setRooms(Array.isArray(data.data)?data.data:data); }
    catch(e) { setError(e.message); }
    finally { setLoading(false); }
  }
  useEffect(()=>{if(user) loadRooms()},[user]);
  const filtered = useMemo(()=>rooms.filter(r=>{
    const q=search.toLowerCase();
    const matches = `${r.room_number} ${r.room_type} ${r.description||''}`.toLowerCase().includes(q);
    return matches && (filter==='All rooms'||r.status===filter);
  }),[rooms,search,filter]);
  const stats = { total:rooms.length, available:rooms.filter(r=>r.status==='Available').length, occupied:rooms.filter(r=>r.status==='Occupied').length, maintenance:rooms.filter(r=>r.status==='Maintenance').length };
  function startAdd(){setForm(blank);setError('');setNotice('');setPage('add');setSelected(null)}
  function viewRoom(room){setSelected(room);setPage('details');setError('');setNotice('')}
  async function saveRoom(e) {
    e.preventDefault();setSaving(true);setError('');setNotice('');
    try {
      const payload={...form, floor:Number(form.floor), capacity:Number(form.capacity), price_per_night:Number(form.price_per_night)};
      const result=await api('/rooms',{method:'POST',body:JSON.stringify(payload)});
      const room=result.data||result;
      setRooms(prev=>[room,...prev]);setSelected(room);setPage('details');setNotice('Room added successfully.');
    } catch(e){setError(e.message)}
    finally{setSaving(false)}
  }
  async function deleteRoom(room) {
    if(!window.confirm(`Delete room ${room.room_number}? This cannot be undone.`))return;
    try {await api(`/rooms/${room.id}`,{method:'DELETE'});setRooms(prev=>prev.filter(r=>r.id!==room.id));setPage('rooms');setNotice('Room deleted.')}
    catch(e){setError(e.message)}
  }
  function logout(){localStorage.removeItem('haven_token');localStorage.removeItem('haven_user');setUser(null);setRooms([]);setPage('rooms')}
  if(!user)return <Login onLogin={setUser}/>;
  return <div className="app-shell">
    <aside className={`sidebar ${mobileNav?'nav-open':''}`}><div className="brand"><span className="brand-icon"><Hotel size={20}/></span><span>haven<span className="brand-dot">.</span></span></div><div className="property-chip"><div className="property-avatar"><Building2 size={18}/></div><div><strong>Haven House</strong><span>Property workspace</span></div><span className="online-dot"/></div><div className="nav-label">WORKSPACE</div><button className={`nav-item ${page==='rooms'||page==='details'?'active':''}`} onClick={()=>{setPage('rooms');setMobileNav(false)}}><LayoutDashboard size={18}/> Room inventory <span className="nav-count">{rooms.length}</span></button><button className={`nav-item ${page==='add'?'active':''}`} onClick={()=>{startAdd();setMobileNav(false)}}><Plus size={18}/> Add a room</button><div className="sidebar-bottom"><div className="help-card"><span className="help-icon"><CheckCircle2 size={17}/></span><div><strong>All in one place</strong><p>Keep your room details organized and up to date.</p></div></div><div className="user-card"><div className="user-avatar"><UserRound size={18}/></div><div className="user-info"><strong>{user.name||'Administrator'}</strong><span>{user.email}</span></div><button className="icon-btn logout-btn" onClick={logout} title="Sign out"><LogOut size={17}/></button></div></div></aside>
    {mobileNav&&<button className="nav-scrim" onClick={()=>setMobileNav(false)} aria-label="Close navigation"/>}
    <main className="main-area"><header className="topbar"><button className="mobile-menu icon-btn" onClick={()=>setMobileNav(!mobileNav)}>{mobileNav?<X/>:<Menu/>}</button><div className="breadcrumbs"><span>Workspace</span><ChevronRight size={14}/><strong>{page==='rooms'?'Room inventory':page==='add'?'Add a room':'Room details'}</strong></div><div className="top-right"><span className="api-status"><span/> API connected</span><div className="top-avatar">{(user.name||'A').charAt(0).toUpperCase()}</div></div></header>
    <div className="content">
      {notice&&<div className="success-banner"><CheckCircle2 size={17}/>{notice}<button onClick={()=>setNotice('')}><X size={15}/></button></div>}
      {error&&page!=='add'&&<div className="error-banner"><AlertCircle size={17}/><span>{error}</span><button onClick={()=>setError('')}><X size={15}/></button></div>}
      {page==='rooms'&&<><div className="page-heading"><div><span className="eyebrow green">PROPERTY OVERVIEW</span><h1>Room inventory</h1><p className="muted">A clear view of every room, all in one place.</p></div><button className="primary-btn" onClick={startAdd}><Plus size={17}/> Add a room</button></div>
      <div className="stats-grid"><Stat icon={<BedDouble/>} label="Total rooms" value={stats.total} tone="sage"/><Stat icon={<CheckCircle2/>} label="Available" value={stats.available} tone="mint"/><Stat icon={<UserRound/>} label="Occupied" value={stats.occupied} tone="amber"/><Stat icon={<Waves/>} label="Maintenance" value={stats.maintenance} tone="rose"/></div>
      <div className="panel room-panel"><div className="panel-head"><div><h3>All rooms <span className="small-count">{rooms.length}</span></h3><p>Manage your room catalog and availability.</p></div><button className="outline-btn" onClick={loadRooms}>Refresh</button></div><div className="table-tools"><div className="search-box"><Search size={16}/><input placeholder="Search room number, type…" value={search} onChange={e=>setSearch(e.target.value)}/></div><select value={filter} onChange={e=>setFilter(e.target.value)}><option>All rooms</option><option>Available</option><option>Occupied</option><option>Maintenance</option></select></div>
      {loading?<div className="empty-state"><div className="spinner"/><p>Loading room inventory…</p></div>:filtered.length===0?<div className="empty-state"><div className="empty-icon"><BedDouble size={25}/></div><h3>{rooms.length===0?'Your room catalog starts here':'No matching rooms'}</h3><p>{rooms.length===0?'Add your first room to begin building your property inventory.':'Try changing your search or filter.'}</p>{rooms.length===0&&<button className="primary-btn" onClick={startAdd}><Plus size={16}/> Add your first room</button>}</div>:<div className="table-wrap"><table><thead><tr><th>ROOM</th><th>ROOM TYPE</th><th>CAPACITY</th><th>PRICE / NIGHT</th><th>STATUS</th><th></th></tr></thead><tbody>{filtered.map(r=><tr key={r.id} onClick={()=>viewRoom(r)} className="click-row"><td><span className="room-number"><BedDouble size={16}/>{r.room_number}</span></td><td>{r.room_type}</td><td>{r.capacity} guests</td><td className="price-cell">{money(r.price_per_night)}</td><td><Status value={r.status}/></td><td><ChevronRight size={16} className="row-arrow"/></td></tr>)}</tbody></table></div>}</div>
      <div className="bottom-note"><span><LockKeyhole size={14}/> Room records are stored in your connected database.</span><span>Last refreshed just now</span></div></>}
      {page==='add'&&<><div className="page-heading"><div><button className="back-link" onClick={()=>{setPage('rooms');setError('')}}><ArrowLeft size={15}/> Back to inventory</button><span className="eyebrow green">ROOM CATALOG</span><h1>Add a room</h1><p className="muted">Enter the details below to add a room to your property.</p></div></div><form className="form-layout" onSubmit={saveRoom}><div className="panel form-panel"><div className="section-title"><span className="section-number">01</span><div><h3>Room information</h3><p>The essentials guests and staff need to know.</p></div></div>{error&&<div className="inline-error"><AlertCircle size={16}/>{error}</div>}<div className="fields-grid"><Field label="Room number" required><input value={form.room_number} onChange={e=>setForm({...form,room_number:e.target.value})} placeholder="e.g. 204" required maxLength="20"/></Field><Field label="Room type" required><select value={form.room_type} onChange={e=>setForm({...form,room_type:e.target.value})}><option>Standard Queen</option><option>Deluxe King</option><option>Twin Room</option><option>Family Suite</option><option>Executive Suite</option><option>Presidential Suite</option></select></Field><Field label="Floor"><select value={form.floor} onChange={e=>setForm({...form,floor:e.target.value})}>{Array.from({length:30},(_,i)=><option key={i+1} value={i+1}>{i+1}{i===0?'st':i===1?'nd':i===2?'rd':'th'} floor</option>)}</select></Field><Field label="Guest capacity" required><select value={form.capacity} onChange={e=>setForm({...form,capacity:e.target.value})}>{[1,2,3,4,5,6,8,10].map(n=><option key={n} value={n}>{n} {n===1?'guest':'guests'}</option>)}</select></Field><Field label="Price per night (USD)" required><div className="money-input"><span>$</span><input type="number" min="0" step=".01" value={form.price_per_night} onChange={e=>setForm({...form,price_per_night:e.target.value})} required/></div></Field><Field label="Room status"><select value={form.status} onChange={e=>setForm({...form,status:e.target.value})}><option>Available</option><option>Occupied</option><option>Maintenance</option></select></Field><Field label="Description" wide><textarea rows="4" value={form.description} onChange={e=>setForm({...form,description:e.target.value})} placeholder="Describe the room, view, bed setup, or special features…"/></Field></div><div className="section-title amenities-title"><span className="section-number">02</span><div><h3>Room amenities</h3><p>Select the amenities available in this room.</p></div></div><div className="amenity-grid">{amenityOptions.map(a=><label className={`amenity-option ${form.amenities.includes(a)?'selected':''}`} key={a}><input type="checkbox" checked={form.amenities.includes(a)} onChange={e=>setForm({...form,amenities:e.target.checked?[...form.amenities,a]:form.amenities.filter(x=>x!==a)})}/><span className="fake-check">{form.amenities.includes(a)&&<CheckCircle2 size={15}/>}</span><span>{a==='Wi-Fi'?<Wifi size={17}/>:a==='Air conditioning'?<Wind size={17}/>:a==='Coffee maker'?<Coffee size={17}/>:a==='TV'?<Tv size={17}/>:<Waves size={17}/>}</span>{a}</label>)}</div></div><div className="form-side"><div className="preview-card"><div className="preview-image"><div className="preview-window"/><div className="preview-bed"><div/></div><span className="preview-label">ROOM PREVIEW</span></div><div className="preview-body"><span className="eyebrow green">NEW LISTING</span><h3>{form.room_number||'Room number'}</h3><p>{form.room_type}</p><div className="preview-price">{money(form.price_per_night)} <span>/ night</span></div><div className="preview-meta"><span><UserRound size={15}/>{form.capacity} guests</span><span><MapPin size={15}/>Floor {form.floor}</span></div><Status value={form.status}/></div></div><div className="form-actions"><button type="button" className="outline-btn full-btn" onClick={()=>setForm(blank)}>Reset form</button><button className="primary-btn full-btn" disabled={saving}>{saving?'Saving room…':'Save room'} <ChevronRight size={16}/></button><p><LockKeyhole size={13}/> Your changes are saved to the database.</p></div></div></form></>}
      {page==='details'&&selected&&<><div className="page-heading"><div><button className="back-link" onClick={()=>setPage('rooms')}><ArrowLeft size={15}/> Back to inventory</button><span className="eyebrow green">ROOM PROFILE</span><h1>Room {selected.room_number}</h1><p className="muted">Room details and current availability.</p></div><button className="danger-btn" onClick={()=>deleteRoom(selected)}>Delete room</button></div><div className="details-grid"><div className="panel detail-hero"><div className="detail-image"><div className="preview-window"/><div className="preview-bed"><div/></div><span className="detail-image-caption">HAVEN HOUSE · ROOM {selected.room_number}</span></div><div className="detail-main"><div><span className="eyebrow green">ROOM {selected.room_number}</span><h2>{selected.room_type}</h2><p className="muted">{selected.description||'A thoughtfully appointed room, ready to welcome your next guest.'}</p></div><Status value={selected.status}/></div><div className="detail-facts"><Fact label="Room number" value={selected.room_number}/><Fact label="Floor" value={`Floor ${selected.floor}`}/><Fact label="Guest capacity" value={`${selected.capacity} guests`}/><Fact label="Price per night" value={money(selected.price_per_night)}/></div><div className="detail-amenities"><h3>Amenities</h3><div className="amenity-chips">{(selected.amenities||[]).map(a=><span key={a}><CheckCircle2 size={14}/>{a}</span>)}{(!selected.amenities||selected.amenities.length===0)&&<span className="muted">No amenities added.</span>}</div></div></div><div className="details-side"><div className="panel side-card"><div className="side-icon"><CalendarDays size={20}/></div><h3>Room record</h3><p>Stored in your property database.</p><div className="side-row"><span>Record ID</span><strong>#{selected.id}</strong></div><div className="side-row"><span>Created</span><strong>{selected.created_at?new Date(selected.created_at).toLocaleDateString():'Recently'}</strong></div><div className="side-row"><span>Status</span><Status value={selected.status}/></div></div><div className="database-note"><CheckCircle2 size={18}/><div><strong>Saved successfully</strong><p>This room is stored by the Laravel API and will remain available after a server restart when using a persistent database.</p></div></div></div></div></>}
    </div></main></div>
}

function Stat({icon,label,value,tone}){return <div className="stat-card"><span className={`stat-icon ${tone}`}>{React.cloneElement(icon,{size:19})}</span><div><span>{label}</span><strong>{value}</strong></div></div>}
function Status({value}){return <span className={`status status-${String(value||'available').toLowerCase()}`}>{value||'Available'}</span>}
function Field({label,required,wide,children}){return <div className={`field ${wide?'wide':''}`}><label>{label}{required&&<span> *</span>}</label>{children}</div>}
function Fact({label,value}){return <div><span>{label}</span><strong>{value}</strong></div>}

export default App;
