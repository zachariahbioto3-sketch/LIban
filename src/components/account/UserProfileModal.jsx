import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { profileApi } from '../../api/profile';
import {
  X, User, MapPin, CreditCard, Package, Shield, Bell, Sliders,
  Download, Plus, Check, Trash2, Edit3, LogOut, Award, Sparkles,
  Lock, Eye, EyeOff, Camera, Truck, Smartphone, Laptop, Tablet, Key,
} from 'lucide-react';

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
];

const CURRENCIES = {
  KES: { code: 'KES', symbol: 'KSh', rate: 1 },
  USD: { code: 'USD', symbol: '$', rate: 0.0077 },
  EUR: { code: 'EUR', symbol: '€', rate: 0.0071 },
  GBP: { code: 'GBP', symbol: '£', rate: 0.0061 },
  NGN: { code: 'NGN', symbol: '₦', rate: 12.5 },
  ZAR: { code: 'ZAR', symbol: 'R', rate: 0.14 },
};

export const UserProfileModal = ({ open, onClose }) => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');

  // Remote state
  const [profile, setProfile] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [cards, setCards] = useState([]);
  const [notifications, setNotifications] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  // Local form state
  const [formData, setFormData] = useState({});
  const [avatarPickerOpen, setAvatarPickerOpen] = useState(false);

  // Address form
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [addressForm, setAddressForm] = useState({
    label: 'Home', full_name: '', email: '', phone: '',
    street: '', city: '', state: '', zip_code: '', country: 'Kenya',
    is_default: false, delivery_instructions: '',
  });

  // Card form
  const [cardModalOpen, setCardModalOpen] = useState(false);
  const [cardForm, setCardForm] = useState({
    holder_name: '', card_number: '', card_brand: 'visa',
    expiry_month: '12', expiry_year: '28', cvv: '',
    is_default: false, card_color: 'from-slate-900 via-indigo-950 to-slate-900',
  });

  // Password form
  const [pwForm, setPwForm] = useState({ current_password: '', new_password: '', confirm: '' });
  const [showPw, setShowPw] = useState(false);

  // Currency
  const [currency, setCurrency] = useState('KES');

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Load all data on open
  useEffect(() => {
    if (!open || !user) return;
    setLoading(true);
    Promise.all([
      profileApi.getProfile(),
      profileApi.getAddresses(),
      profileApi.getCards(),
      profileApi.getNotifications(),
    ]).then(([prof, addrs, cds, notifs]) => {
      setProfile(prof);
      setFormData({
        first_name: prof.first_name || '',
        last_name: prof.last_name || '',
        email: prof.email || '',
        phone: prof.phone || '',
        bio: prof.bio || '',
        company: prof.company || '',
        birthday: prof.birthday || '',
        avatar_url: prof.avatar_url || AVATAR_PRESETS[0],
      });
      setAddresses(addrs);
      setCards(cds);
      setNotifications(notifs);
    }).catch(() => showToast('Failed to load profile data.', 'error'))
      .finally(() => setLoading(false));
  }, [open, user]);

  if (!open) return null;

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      const updated = await profileApi.updateProfile(formData);
      setProfile(updated);
      showToast('Profile saved successfully.');
    } catch {
      showToast('Failed to save profile.', 'error');
    }
  };

  const handleOpenAddressModal = (addr) => {
    if (addr) {
      setEditingAddressId(addr.id);
      setAddressForm({
        label: addr.label, full_name: addr.full_name, email: addr.email,
        phone: addr.phone, street: addr.street, city: addr.city,
        state: addr.state, zip_code: addr.zip_code, country: addr.country,
        is_default: addr.is_default, delivery_instructions: addr.delivery_instructions || '',
      });
    } else {
      setEditingAddressId(null);
      setAddressForm({
        label: 'Home', full_name: user?.first_name || '', email: user?.email || '',
        phone: profile?.phone || '', street: '', city: '', state: '',
        zip_code: '', country: 'Kenya', is_default: addresses.length === 0,
        delivery_instructions: '',
      });
    }
    setAddressModalOpen(true);
  };

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    if (!addressForm.street || !addressForm.city || !addressForm.zip_code) {
      showToast('Please fill in street, city, and zip code.', 'error');
      return;
    }
    try {
      if (editingAddressId) {
        const updated = await profileApi.updateAddress(editingAddressId, addressForm);
        setAddresses((prev) => prev.map((a) => a.id === editingAddressId ? updated : a));
      } else {
        const created = await profileApi.createAddress(addressForm);
        setAddresses((prev) => [...prev, created]);
      }
      setAddressModalOpen(false);
      showToast('Address saved.');
    } catch {
      showToast('Failed to save address.', 'error');
    }
  };

  const handleDeleteAddress = async (id) => {
    try {
      await profileApi.deleteAddress(id);
      setAddresses((prev) => prev.filter((a) => a.id !== id));
      showToast('Address removed.');
    } catch {
      showToast('Failed to delete address.', 'error');
    }
  };

  const handleSetDefaultAddress = async (id) => {
    try {
      const updated = await profileApi.updateAddress(id, { is_default: true });
      setAddresses((prev) => prev.map((a) => ({ ...a, is_default: a.id === id })));
      showToast('Default address updated.');
    } catch {
      showToast('Failed to update default.', 'error');
    }
  };

  const handleSaveCard = async (e) => {
    e.preventDefault();
    const raw = cardForm.card_number.replace(/\s+/g, '');
    if (raw.length < 15) { showToast('Invalid card number.', 'error'); return; }
    try {
      const payload = {
        holder_name: cardForm.holder_name,
        card_number_last4: raw.slice(-4),
        card_brand: cardForm.card_brand,
        expiry_month: cardForm.expiry_month,
        expiry_year: cardForm.expiry_year,
        is_default: cardForm.is_default || cards.length === 0,
        card_color: cardForm.card_color,
      };
      const created = await profileApi.createCard(payload);
      setCards((prev) => [...prev, created]);
      setCardModalOpen(false);
      setCardForm({ holder_name: '', card_number: '', card_brand: 'visa', expiry_month: '12', expiry_year: '28', cvv: '', is_default: false, card_color: 'from-slate-900 via-indigo-950 to-slate-900' });
      showToast('Card added.');
    } catch {
      showToast('Failed to add card.', 'error');
    }
  };

  const handleDeleteCard = async (id) => {
    try {
      await profileApi.deleteCard(id);
      setCards((prev) => prev.filter((c) => c.id !== id));
      showToast('Card removed.');
    } catch {
      showToast('Failed to delete card.', 'error');
    }
  };

  const handleNotificationChange = async (key, value) => {
    const updated = { ...notifications, [key]: value };
    setNotifications(updated);
    try {
      await profileApi.updateNotifications({ [key]: value });
    } catch {
      showToast('Failed to update notifications.', 'error');
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (pwForm.new_password.length < 8) { showToast('Password must be at least 8 characters.', 'error'); return; }
    if (pwForm.new_password !== pwForm.confirm) { showToast('Passwords do not match.', 'error'); return; }
    try {
      await profileApi.changePassword({ current_password: pwForm.current_password, new_password: pwForm.new_password });
      setPwForm({ current_password: '', new_password: '', confirm: '' });
      showToast('Password updated successfully.');
    } catch (err) {
      showToast(err.message || 'Failed to change password.', 'error');
    }
  };

  const navItems = [
    { id: 'profile',        label: 'Profile & Account',    icon: <User className="w-4 h-4 text-indigo-300" /> },
    { id: 'addresses',      label: 'Addresses & Delivery', icon: <MapPin className="w-4 h-4 text-emerald-400" />, badge: addresses.length },
    { id: 'payments',       label: 'Cards & Wallet',       icon: <CreditCard className="w-4 h-4 text-blue-400" />, badge: cards.length },
    { id: 'security',       label: 'Security & Logins',    icon: <Shield className="w-4 h-4 text-rose-400" /> },
    { id: 'notifications',  label: 'Notifications',        icon: <Bell className="w-4 h-4 text-purple-400" /> },
    { id: 'preferences',    label: 'Display & Currency',   icon: <Sliders className="w-4 h-4 text-teal-400" /> },
    { id: 'privacy',        label: 'Data & Privacy',       icon: <Download className="w-4 h-4 text-slate-400" /> },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-2 sm:p-4 bg-black/70 backdrop-blur-md">

      {/* Toast */}
      {toast && (
        <div className={ixed top-5 right-5 z-[100] px-5 py-3 rounded-2xl text-white text-xs font-bold shadow-xl }>
          {toast.msg}
        </div>
      )}

      <div className="relative w-full max-w-6xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col md:flex-row max-h-[92vh]">

        {/* Close */}
        <button onClick={onClose} className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-slate-100/80 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer">
          <X className="w-5 h-5" />
        </button>

        {/* ── SIDEBAR ── */}
        <div className="w-full md:w-80 bg-slate-900 text-white p-6 flex flex-col justify-between shrink-0 border-b md:border-b-0 md:border-r border-slate-800">
          <div className="space-y-6">

            {/* Avatar + name */}
            <div className="flex items-center gap-4">
              <div className="relative group cursor-pointer" onClick={() => setAvatarPickerOpen((p) => !p)}>
                <img
                  src={formData.avatar_url || AVATAR_PRESETS[0]}
                  alt="avatar"
                  className="w-16 h-16 rounded-2xl object-cover ring-2 ring-indigo-500 shadow-md group-hover:opacity-85 transition-opacity"
                />
                <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-base font-bold text-white truncate">{user?.first_name || user?.username}</h3>
                  <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                </div>
                <p className="text-xs text-slate-400 truncate">{user?.email}</p>
                <span className="mt-1.5 inline-block px-2 py-0.5 rounded-md bg-indigo-900/80 text-indigo-300 text-[10px] font-bold tracking-wide uppercase border border-indigo-700/50">
                  {profile?.member_tier || 'standard'}
                </span>
              </div>
            </div>

            {/* Rewards */}
            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/60">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <div className="flex items-center gap-1.5 text-amber-400 font-bold">
                  <Award className="w-4 h-4" />
                  <span>LIBAN Rewards</span>
                </div>
                <span className="font-mono text-amber-300 font-extrabold">{(profile?.loyalty_points || 0).toLocaleString()} Pts</span>
              </div>
              <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden my-2">
                <div className="bg-gradient-to-r from-amber-400 to-indigo-400 h-full w-[62%]" />
              </div>
              <div className="flex items-center justify-between text-[10px] text-slate-400">
                <span>Value: <strong className="text-white">KSh {(profile?.loyalty_points || 0).toLocaleString()}</strong></span>
                <span>Tier: {profile?.member_tier || 'Standard'}</span>
              </div>
            </div>

            {/* Nav */}
            <nav className="space-y-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer }
                >
                  <div className="flex items-center gap-2.5">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                  {item.badge != null && (
                    <span className="px-2 py-0.5 rounded-full bg-slate-800 text-[10px] text-slate-300">{item.badge}</span>
                  )}
                </button>
              ))}
            </nav>
          </div>

          {/* Footer */}
          <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Member since {profile?.member_since || '—'}</span>
            <button onClick={() => { logout(); onClose(); }} className="text-slate-400 hover:text-rose-400 transition-colors flex items-center gap-1 cursor-pointer">
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div className="flex-1 p-6 sm:p-8 overflow-y-auto bg-slate-50/50 min-h-[500px]">
          {loading ? (
            <div className="flex items-center justify-center h-full text-slate-400 text-sm">Loading…</div>
          ) : (
            <>
              {/* TAB: Profile */}
              {activeTab === 'profile' && (
                <div className="space-y-6 max-w-2xl">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">Personal Information</h2>
                    <p className="text-xs text-slate-500">Manage your name, contact info, bio, and avatar.</p>
                  </div>

                  {avatarPickerOpen && (
                    <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900">Choose Profile Photo</span>
                        <button onClick={() => setAvatarPickerOpen(false)} className="text-xs text-slate-400 hover:text-slate-700 cursor-pointer">Close</button>
                      </div>
                      <div className="grid grid-cols-6 gap-2">
                        {AVATAR_PRESETS.map((preset, idx) => (
                          <button
                            key={idx}
                            onClick={() => { setFormData((p) => ({ ...p, avatar_url: preset })); setAvatarPickerOpen(false); }}
                            className={w-12 h-12 rounded-xl overflow-hidden border-2 transition-all cursor-pointer }
                          >
                            <img src={preset} alt="" className="w-full h-full object-cover" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <form onSubmit={handleSaveProfile} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">First Name</label>
                        <input type="text" value={formData.first_name || ''} onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">Last Name</label>
                        <input type="text" value={formData.last_name || ''} onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">Email Address</label>
                        <input type="email" value={formData.email || ''} onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">Phone Number</label>
                        <input type="tel" value={formData.phone || ''} onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">Company</label>
                        <input type="text" value={formData.company || ''} onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                          placeholder="e.g. LIBAN Tech Labs"
                          className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">Birthday</label>
                        <input type="date" value={formData.birthday || ''} onChange={(e) => setFormData({ ...formData, birthday: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">Bio</label>
                      <textarea rows={3} value={formData.bio || ''} onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                    </div>
                    <button type="submit" className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold transition-all cursor-pointer">
                      <Check className="w-4 h-4" /> Save Changes
                    </button>
                  </form>
                </div>
              )}

              {/* TAB: Addresses */}
              {activeTab === 'addresses' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h2 className="text-xl font-bold text-slate-900">Saved Addresses</h2>
                      <p className="text-xs text-slate-500">Manage your shipping locations.</p>
                    </div>
                    <button onClick={() => handleOpenAddressModal(null)} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold cursor-pointer">
                      <Plus className="w-4 h-4" /> Add New Address
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {addresses.map((addr) => (
                      <div key={addr.id} className={p-5 rounded-2xl bg-white border flex flex-col justify-between }>
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-sm text-slate-900">{addr.label}</span>
                              {addr.is_default && <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-bold border border-indigo-200">Default</span>}
                            </div>
                            <div className="flex items-center gap-1">
                              <button onClick={() => handleOpenAddressModal(addr)} className="p-1.5 text-slate-400 hover:text-slate-900 cursor-pointer"><Edit3 className="w-3.5 h-3.5" /></button>
                              {addresses.length > 1 && (
                                <button onClick={() => handleDeleteAddress(addr.id)} className="p-1.5 text-slate-400 hover:text-rose-600 cursor-pointer"><Trash2 className="w-3.5 h-3.5" /></button>
                              )}
                            </div>
                          </div>
                          <p className="text-xs font-semibold text-slate-800">{addr.full_name}</p>
                          <p className="text-xs text-slate-600 mt-0.5">{addr.street}</p>
                          <p className="text-xs text-slate-600">{addr.city}, {addr.state} {addr.zip_code}</p>
                          <p className="text-xs text-slate-500 mt-1">{addr.phone}</p>
                          {addr.delivery_instructions && (
                            <div className="mt-3 p-2 rounded-lg bg-slate-50 border border-slate-100 text-[11px] text-slate-600">
                              <strong>Note:</strong> {addr.delivery_instructions}
                            </div>
                          )}
                        </div>
                        {!addr.is_default && (
                          <div className="mt-4 pt-3 border-t border-slate-100">
                            <button onClick={() => handleSetDefaultAddress(addr.id)} className="text-xs font-bold text-indigo-600 hover:underline cursor-pointer">Set as Default</button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB: Payments */}
              {activeTab === 'payments' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h2 className="text-xl font-bold text-slate-900">Cards & Wallet</h2>
                      <p className="text-xs text-slate-500">Stored payment methods for fast checkout.</p>
                    </div>
                    <button onClick={() => setCardModalOpen(true)} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold cursor-pointer">
                      <Plus className="w-4 h-4" /> Add Card
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {cards.map((card) => (
                      <div key={card.id} className={p-6 rounded-2xl text-white bg-gradient-to-br  shadow-md relative overflow-hidden flex flex-col justify-between h-48 border border-white/10}>
                        <div className="absolute -right-8 -bottom-8 w-36 h-36 bg-white/10 rounded-full blur-2xl pointer-events-none" />
                        <div className="flex items-center justify-between relative z-10">
                          <span className="px-2 py-0.5 rounded-md bg-white/20 text-[10px] font-mono tracking-widest font-bold uppercase">{card.card_brand}</span>
                          {card.is_default
                            ? <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-bold">Default</span>
                            : <button onClick={() => handleDeleteCard(card.id)} className="text-white/60 hover:text-rose-300 cursor-pointer"><Trash2 className="w-3.5 h-3.5" /></button>
                          }
                        </div>
                        <div className="relative z-10 my-2">
                          <div className="w-10 h-7 rounded-md bg-amber-400/80 mb-2 border border-amber-300" />
                          <p className="font-mono tracking-widest text-lg font-bold">•••• •••• •••• {card.card_number_last4}</p>
                        </div>
                        <div className="flex items-center justify-between text-xs text-white/80 relative z-10">
                          <div>
                            <span className="text-[9px] uppercase tracking-wider block text-white/50">Card Holder</span>
                            <span className="font-bold tracking-wide">{card.holder_name}</span>
                          </div>
                          <div className="text-right">
                            <span className="text-[9px] uppercase tracking-wider block text-white/50">Expires</span>
                            <span className="font-mono font-bold">{card.expiry_month}/{card.expiry_year}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB: Security */}
              {activeTab === 'security' && (
                <div className="space-y-6 max-w-2xl">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">Security & Sign-in</h2>
                    <p className="text-xs text-slate-500">Update your password and protect your account.</p>
                  </div>
                  <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-4">
                    <div className="flex items-center gap-2">
                      <Lock className="w-4 h-4 text-indigo-600" />
                      <h3 className="text-sm font-bold text-slate-900">Change Password</h3>
                    </div>
                    <form onSubmit={handleChangePassword} className="space-y-3">
                      <div>
                        <label className="text-[11px] font-bold text-slate-600 uppercase block mb-1">Current Password</label>
                        <div className="relative">
                          <input type={showPw ? 'text' : 'password'} required value={pwForm.current_password}
                            onChange={(e) => setPwForm({ ...pwForm, current_password: e.target.value })}
                            placeholder="••••••••"
                            className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                          <button type="button" onClick={() => setShowPw((p) => !p)} className="absolute right-3 top-2.5 text-slate-400 cursor-pointer">
                            {showPw ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-[11px] font-bold text-slate-600 uppercase block mb-1">New Password</label>
                          <input type={showPw ? 'text' : 'password'} required value={pwForm.new_password}
                            onChange={(e) => setPwForm({ ...pwForm, new_password: e.target.value })}
                            placeholder="Min 8 characters"
                            className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                        </div>
                        <div>
                          <label className="text-[11px] font-bold text-slate-600 uppercase block mb-1">Confirm Password</label>
                          <input type={showPw ? 'text' : 'password'} required value={pwForm.confirm}
                            onChange={(e) => setPwForm({ ...pwForm, confirm: e.target.value })}
                            placeholder="Re-enter password"
                            className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                        </div>
                      </div>
                      <button type="submit" className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold cursor-pointer">
                        Update Password
                      </button>
                    </form>
                  </div>
                </div>
              )}

              {/* TAB: Notifications */}
              {activeTab === 'notifications' && notifications && (
                <div className="space-y-6 max-w-2xl">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">Notifications</h2>
                    <p className="text-xs text-slate-500">Choose how LIBAN contacts you.</p>
                  </div>
                  <div className="bg-white rounded-2xl border border-slate-200 p-5 divide-y divide-slate-100 space-y-3">
                    {[
                      { key: 'order_updates_email', label: 'Order Updates (Email)', desc: 'Receipts, shipping notices, tracking numbers.' },
                      { key: 'order_updates_sms', label: 'SMS Dispatch Alerts', desc: 'Text alerts when couriers are out for delivery.' },
                      { key: 'driver_arrival_alerts', label: 'Driver Arrival Alerts', desc: 'Alert when driver is within 5 minutes.' },
                      { key: 'price_drop_alerts', label: 'Wishlist Price Drops', desc: 'Notify when a wishlist item goes on sale.' },
                      { key: 'weekly_digest', label: 'Weekly Digest', desc: 'Curated articles and new product highlights.' },
                    ].map(({ key, label, desc }) => (
                      <div key={key} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                        <div>
                          <span className="text-xs font-bold text-slate-900 block">{label}</span>
                          <span className="text-[11px] text-slate-500">{desc}</span>
                        </div>
                        <input type="checkbox" checked={!!notifications[key]}
                          onChange={(e) => handleNotificationChange(key, e.target.checked)}
                          className="w-5 h-5 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300 cursor-pointer" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB: Preferences */}
              {activeTab === 'preferences' && (
                <div className="space-y-6 max-w-2xl">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">Display & Currency</h2>
                    <p className="text-xs text-slate-500">Set your store currency and regional preferences.</p>
                  </div>
                  <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-4">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Store Currency</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {Object.values(CURRENCIES).map((curr) => (
                        <button key={curr.code} onClick={() => setCurrency(curr.code)}
                          className={p-3 rounded-xl border text-left transition-all cursor-pointer }>
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-xs text-slate-900">{curr.code}</span>
                            <span className="font-mono text-xs text-indigo-600 font-bold">{curr.symbol}</span>
                          </div>
                          <span className="text-[10px] text-slate-400 block mt-1">Rate: {curr.rate}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB: Privacy */}
              {activeTab === 'privacy' && (
                <div className="space-y-6 max-w-2xl">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">Data & Privacy</h2>
                    <p className="text-xs text-slate-500">Export or reset your account data.</p>
                  </div>
                  <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold text-slate-900 block">Export Account Archive</span>
                        <span className="text-[11px] text-slate-500">Download your profile and address data as JSON.</span>
                      </div>
                      <button
                        onClick={() => {
                          const payload = { profile, addresses, cards, exportedAt: new Date().toISOString() };
                          const url = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(payload, null, 2));
                          const a = document.createElement('a');
                          a.setAttribute('href', url);
                          a.setAttribute('download', 'liban_account.json');
                          document.body.appendChild(a);
                          a.click();
                          a.remove();
                          showToast('Archive downloaded.');
                        }}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold cursor-pointer">
                        <Download className="w-3.5 h-3.5" /> Export JSON
                      </button>
                    </div>
                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold text-rose-600 block">Reset Demo Cache</span>
                        <span className="text-[11px] text-slate-500">Clear browser storage and reload.</span>
                      </div>
                      <button
                        onClick={() => { if (window.confirm('Reset all local data?')) { localStorage.clear(); window.location.reload(); } }}
                        className="px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold border border-rose-200 cursor-pointer">
                        Reset Storage
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* ADDRESS SUB-MODAL */}
      {addressModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">{editingAddressId ? 'Edit Address' : 'Add Address'}</h3>
              <button onClick={() => setAddressModalOpen(false)} className="p-1 rounded-full text-slate-400 hover:text-slate-700 cursor-pointer"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleSaveAddress} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-600 uppercase block mb-1">Label</label>
                  <select value={addressForm.label} onChange={(e) => setAddressForm({ ...addressForm, label: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500">
                    {['Home','Office','Studio','Warehouse','Other'].map((l) => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-600 uppercase block mb-1">Recipient Name</label>
                  <input type="text" required value={addressForm.full_name} onChange={(e) => setAddressForm({ ...addressForm, full_name: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500" />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-600 uppercase block mb-1">Street</label>
                <input type="text" required value={addressForm.street} onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
                  placeholder="e.g. Tom Mboya St, 4th Floor"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-slate-600 uppercase block mb-1">City</label>
                  <input type="text" required value={addressForm.city} onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-600 uppercase block mb-1">County</label>
                  <input type="text" value={addressForm.state} onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-600 uppercase block mb-1">Postal Code</label>
                  <input type="text" required value={addressForm.zip_code} onChange={(e) => setAddressForm({ ...addressForm, zip_code: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500" />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-600 uppercase block mb-1">Courier Notes</label>
                <input type="text" value={addressForm.delivery_instructions} onChange={(e) => setAddressForm({ ...addressForm, delivery_instructions: e.target.value })}
                  placeholder="e.g. Call on arrival, gate code #4321"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div className="flex items-center gap-2 pt-1">
                <input type="checkbox" id="addr-default" checked={addressForm.is_default} onChange={(e) => setAddressForm({ ...addressForm, is_default: e.target.checked })}
                  className="w-4 h-4 rounded text-indigo-600 border-slate-300 cursor-pointer" />
                <label htmlFor="addr-default" className="text-xs text-slate-700 font-semibold cursor-pointer">Set as primary delivery address</label>
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button type="button" onClick={() => setAddressModalOpen(false)} className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer">Cancel</button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold cursor-pointer">Save Address</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CARD SUB-MODAL */}
      {cardModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Add Payment Card</h3>
              <button onClick={() => setCardModalOpen(false)} className="p-1 rounded-full text-slate-400 hover:text-slate-700 cursor-pointer"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleSaveCard} className="space-y-3">
              <div>
                <label className="text-[10px] font-bold text-slate-600 uppercase block mb-1">Card Holder Name</label>
                <input type="text" required value={cardForm.holder_name}
                  onChange={(e) => setCardForm({ ...cardForm, holder_name: e.target.value.toUpperCase() })}
                  placeholder="JOHN DOE"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-600 uppercase block mb-1">Card Number</label>
                <input type="text" required maxLength={19} value={cardForm.card_number}
                  onChange={(e) => {
                    const v = e.target.value.replace(/\D/g, '').replace(/(\d{4})/g, ' ').trim();
                    setCardForm({ ...cardForm, card_number: v });
                  }}
                  placeholder="4000 1234 5678 9010"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono tracking-wider focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-slate-600 uppercase block mb-1">Brand</label>
                  <select value={cardForm.card_brand} onChange={(e) => setCardForm({ ...cardForm, card_brand: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500">
                    {['visa','mastercard','amex','discover'].map((b) => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-600 uppercase block mb-1">Expiry</label>
                  <div className="flex gap-1">
                    <select value={cardForm.expiry_month} onChange={(e) => setCardForm({ ...cardForm, expiry_month: e.target.value })}
                      className="w-1/2 px-2 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs">
                      {Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0')).map((m) => <option key={m} value={m}>{m}</option>)}
                    </select>
                    <select value={cardForm.expiry_year} onChange={(e) => setCardForm({ ...cardForm, expiry_year: e.target.value })}
                      className="w-1/2 px-2 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs">
                      {['25','26','27','28','29','30'].map((y) => <option key={y} value={y}>{y}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-600 uppercase block mb-1">CVV</label>
                  <input type="password" required maxLength={4} value={cardForm.cvv}
                    onChange={(e) => setCardForm({ ...cardForm, cvv: e.target.value })}
                    placeholder="•••"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-center font-mono focus:ring-2 focus:ring-indigo-500" />
                </div>
              </div>
              <div className="flex items-center gap-2 pt-1">
                <input type="checkbox" id="card-default" checked={cardForm.is_default}
                  onChange={(e) => setCardForm({ ...cardForm, is_default: e.target.checked })}
                  className="w-4 h-4 rounded text-indigo-600 border-slate-300 cursor-pointer" />
                <label htmlFor="card-default" className="text-xs text-slate-700 font-semibold cursor-pointer">Set as default card</label>
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button type="button" onClick={() => setCardModalOpen(false)} className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer">Cancel</button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold cursor-pointer">Save Card</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
