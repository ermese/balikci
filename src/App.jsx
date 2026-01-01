import { useState } from 'react';
import './index.css';
import useStorage from './hooks/useStorage';

// Tarih formatlama
const formatDate = (date) => {
  return new Date(date).toLocaleDateString('tr-TR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const formatTime = (timestamp) => {
  return new Date(timestamp).toLocaleTimeString('tr-TR', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Dashboard Bileşeni
function Dashboard({ stats, onNavigate }) {
  return (
    <>
      <div className="stats-grid">
        <div className="stat-card incoming">
          <div className="stat-icon">📥</div>
          <div className="stat-value">{stats.totalEntry}</div>
          <div className="stat-label">Giriş (kg)</div>
        </div>
        <div className="stat-card outgoing">
          <div className="stat-icon">📤</div>
          <div className="stat-value">{stats.totalExit}</div>
          <div className="stat-label">Çıkış (kg)</div>
        </div>
        <div className="stat-card stock">
          <div className="stat-icon">📦</div>
          <div className="stat-value">{stats.totalStock}</div>
          <div className="stat-label">Stok (kg)</div>
        </div>
        <div className="stat-card types">
          <div className="stat-icon">🐟</div>
          <div className="stat-value">{stats.uniqueTypes}</div>
          <div className="stat-label">Tür</div>
        </div>
      </div>

      <div className="glass-card">
        <h3 className="section-title">⚡ Hızlı İşlemler</h3>
        <div className="quick-actions">
          <button className="action-btn entry" onClick={() => onNavigate('entry')}>
            <span>📥</span>
            <span>Balık Girişi</span>
          </button>
          <button className="action-btn exit" onClick={() => onNavigate('exit')}>
            <span>📤</span>
            <span>Balık Çıkışı</span>
          </button>
          <button className="action-btn stock" onClick={() => onNavigate('stock')}>
            <span>📦</span>
            <span>Stok</span>
          </button>
          <button className="action-btn report" onClick={() => onNavigate('report')}>
            <span>📊</span>
            <span>Rapor</span>
          </button>
        </div>
      </div>
    </>
  );
}

// Balık Girişi Bileşeni
function FishEntry({ fishTypes, onAdd, onBack }) {
  const [formData, setFormData] = useState({
    fishTypeId: '',
    quantity: '',
    note: '',
  });
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.fishTypeId || !formData.quantity) return;

    onAdd({
      fishTypeId: parseInt(formData.fishTypeId),
      quantity: parseFloat(formData.quantity),
      note: formData.note,
    });

    setFormData({ fishTypeId: '', quantity: '', note: '' });
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  };

  return (
    <>
      <button className="back-btn" onClick={onBack}>
        ← Geri
      </button>

      <div className="glass-card">
        <h2 className="section-title">📥 Balık Girişi</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Balık Türü</label>
            <select
              className="form-select"
              value={formData.fishTypeId}
              onChange={(e) => setFormData({ ...formData, fishTypeId: e.target.value })}
              required
            >
              <option value="">Seçiniz...</option>
              {fishTypes.map((fish) => (
                <option key={fish.id} value={fish.id}>
                  {fish.icon} {fish.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Miktar (kg)</label>
            <input
              type="number"
              className="form-input"
              placeholder="Örn: 50"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              min="0.1"
              step="0.1"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Not (Opsiyonel)</label>
            <textarea
              className="form-textarea"
              placeholder="Kaynak, tedarikçi vb."
              value={formData.note}
              onChange={(e) => setFormData({ ...formData, note: e.target.value })}
            />
          </div>

          <button type="submit" className="submit-btn entry">
            ✓ Girişi Kaydet
          </button>
        </form>
      </div>

      {showSuccess && (
        <div className="success-message">
          ✓ Giriş kaydedildi!
        </div>
      )}
    </>
  );
}

// Balık Çıkışı Bileşeni
function FishExit({ fishTypes, stock, onAdd, onBack }) {
  const [formData, setFormData] = useState({
    fishTypeId: '',
    quantity: '',
    customer: '',
    note: '',
  });
  const [showSuccess, setShowSuccess] = useState(false);

  const selectedStock = stock.find((s) => s.id === parseInt(formData.fishTypeId));
  const maxQuantity = selectedStock?.quantity || 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.fishTypeId || !formData.quantity) return;
    if (parseFloat(formData.quantity) > maxQuantity) {
      alert('Stokta yeterli balık yok!');
      return;
    }

    onAdd({
      fishTypeId: parseInt(formData.fishTypeId),
      quantity: parseFloat(formData.quantity),
      customer: formData.customer,
      note: formData.note,
    });

    setFormData({ fishTypeId: '', quantity: '', customer: '', note: '' });
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  };

  return (
    <>
      <button className="back-btn" onClick={onBack}>
        ← Geri
      </button>

      <div className="glass-card">
        <h2 className="section-title">📤 Balık Çıkışı</h2>

        {stock.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📦</div>
            <p>Stokta balık bulunmuyor</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Balık Türü</label>
              <select
                className="form-select"
                value={formData.fishTypeId}
                onChange={(e) => setFormData({ ...formData, fishTypeId: e.target.value, quantity: '' })}
                required
              >
                <option value="">Seçiniz...</option>
                {stock.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.icon} {item.name} ({item.quantity} kg mevcut)
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">
                Miktar (kg) {maxQuantity > 0 && <span style={{ color: '#64748b' }}>- Max: {maxQuantity} kg</span>}
              </label>
              <input
                type="number"
                className="form-input"
                placeholder="Örn: 10"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                min="0.1"
                max={maxQuantity}
                step="0.1"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Müşteri (Opsiyonel)</label>
              <input
                type="text"
                className="form-input"
                placeholder="Müşteri adı"
                value={formData.customer}
                onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Not (Opsiyonel)</label>
              <textarea
                className="form-textarea"
                placeholder="Ek bilgi..."
                value={formData.note}
                onChange={(e) => setFormData({ ...formData, note: e.target.value })}
              />
            </div>

            <button type="submit" className="submit-btn exit">
              ✓ Çıkışı Kaydet
            </button>
          </form>
        )}
      </div>

      {showSuccess && (
        <div className="success-message">
          ✓ Çıkış kaydedildi!
        </div>
      )}
    </>
  );
}

// Stok Listesi Bileşeni
function StockList({ stock, onBack }) {
  const totalStock = stock.reduce((sum, s) => sum + s.quantity, 0);

  return (
    <>
      <button className="back-btn" onClick={onBack}>
        ← Geri
      </button>

      <div className="glass-card">
        <h2 className="section-title">📦 Mevcut Stok</h2>

        {stock.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📦</div>
            <p>Stokta balık bulunmuyor</p>
          </div>
        ) : (
          <>
            <div style={{
              textAlign: 'center',
              marginBottom: '1.5rem',
              padding: '1rem',
              background: 'var(--primary-50)',
              borderRadius: 'var(--radius-md)'
            }}>
              <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--primary-700)' }}>
                {totalStock.toFixed(1)} kg
              </div>
              <div style={{ color: 'var(--gray-500)', fontSize: '0.9rem' }}>Toplam Stok</div>
            </div>

            <div className="fish-list">
              {stock.map((item) => (
                <div key={item.id} className="fish-item">
                  <div className="fish-info">
                    <span className="fish-icon">{item.icon}</span>
                    <div>
                      <div className="fish-name">{item.name}</div>
                      <div className="fish-amount">
                        {((item.quantity / totalStock) * 100).toFixed(1)}% oranında
                      </div>
                    </div>
                  </div>
                  <div className="fish-quantity">{item.quantity.toFixed(1)} kg</div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}

// Günlük Rapor Bileşeni
function DailyReport({ fishTypes, transactions, stats, onDeleteEntry, onDeleteExit, onBack }) {
  const [filter, setFilter] = useState('all');

  const filteredTransactions = transactions.filter((t) => {
    if (filter === 'all') return true;
    return t.type === filter;
  });

  const getFishName = (fishTypeId) => {
    const fish = fishTypes.find((f) => f.id === fishTypeId);
    return fish ? `${fish.icon} ${fish.name}` : 'Bilinmiyor';
  };

  const handleDelete = (transaction) => {
    if (window.confirm('Bu kaydı silmek istediğinizden emin misiniz?')) {
      if (transaction.type === 'entry') {
        onDeleteEntry(transaction.id);
      } else {
        onDeleteExit(transaction.id);
      }
    }
  };

  return (
    <>
      <button className="back-btn" onClick={onBack}>
        ← Geri
      </button>

      <div className="glass-card">
        <h2 className="section-title">📊 Günlük Rapor</h2>

        <div className="stats-grid" style={{ marginBottom: '1.5rem' }}>
          <div className="stat-card incoming">
            <div className="stat-value">{stats.totalEntry}</div>
            <div className="stat-label">Giriş (kg)</div>
          </div>
          <div className="stat-card outgoing">
            <div className="stat-value">{stats.totalExit}</div>
            <div className="stat-label">Çıkış (kg)</div>
          </div>
        </div>

        <div className="filter-tabs">
          <button
            className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            Tümü
          </button>
          <button
            className={`filter-tab ${filter === 'entry' ? 'active' : ''}`}
            onClick={() => setFilter('entry')}
          >
            📥 Girişler
          </button>
          <button
            className={`filter-tab ${filter === 'exit' ? 'active' : ''}`}
            onClick={() => setFilter('exit')}
          >
            📤 Çıkışlar
          </button>
        </div>

        {filteredTransactions.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📋</div>
            <p>Bugün için kayıt bulunmuyor</p>
          </div>
        ) : (
          <div className="transaction-list">
            {filteredTransactions.map((t) => (
              <div key={`${t.type}-${t.id}`} className={`transaction-item ${t.type}`}>
                <div className="transaction-info">
                  <div className="transaction-fish">{getFishName(t.fishTypeId)}</div>
                  <div className="transaction-time">
                    {formatTime(t.timestamp)}
                    {t.customer && ` • ${t.customer}`}
                    {t.note && ` • ${t.note}`}
                  </div>
                </div>
                <div className={`transaction-amount ${t.type}`}>
                  {t.type === 'entry' ? '+' : '-'}{t.quantity} kg
                </div>
                <button className="delete-btn" onClick={() => handleDelete(t)}>
                  🗑️
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

// Ana Uygulama
function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const {
    fishTypes,
    addEntry,
    addExit,
    deleteEntry,
    deleteExit,
    calculateStock,
    getDailyStats,
    getAllTransactions,
  } = useStorage();

  const stats = getDailyStats();
  const stock = calculateStock();
  const transactions = getAllTransactions(new Date());

  const handleNavigate = (view) => {
    setCurrentView(view);
  };

  const handleBack = () => {
    setCurrentView('dashboard');
  };

  return (
    <div className="app-container">
      {/* Header */}
      <header className="header">
        <h1>🐟 Balıkhane</h1>
        <p className="header-date">{formatDate(new Date())}</p>
      </header>

      {/* Content */}
      {currentView === 'dashboard' && (
        <Dashboard stats={stats} onNavigate={handleNavigate} />
      )}

      {currentView === 'entry' && (
        <FishEntry fishTypes={fishTypes} onAdd={addEntry} onBack={handleBack} />
      )}

      {currentView === 'exit' && (
        <FishExit fishTypes={fishTypes} stock={stock} onAdd={addExit} onBack={handleBack} />
      )}

      {currentView === 'stock' && (
        <StockList stock={stock} onBack={handleBack} />
      )}

      {currentView === 'report' && (
        <DailyReport
          fishTypes={fishTypes}
          transactions={transactions}
          stats={stats}
          onDeleteEntry={deleteEntry}
          onDeleteExit={deleteExit}
          onBack={handleBack}
        />
      )}

      {/* Bottom Navigation */}
      <nav className="bottom-nav">
        <button
          className={`nav-item ${currentView === 'dashboard' ? 'active' : ''}`}
          onClick={() => handleNavigate('dashboard')}
        >
          <span>🏠</span>
          <span>Ana Sayfa</span>
        </button>
        <button
          className={`nav-item ${currentView === 'entry' ? 'active' : ''}`}
          onClick={() => handleNavigate('entry')}
        >
          <span>📥</span>
          <span>Giriş</span>
        </button>
        <button
          className={`nav-item ${currentView === 'exit' ? 'active' : ''}`}
          onClick={() => handleNavigate('exit')}
        >
          <span>📤</span>
          <span>Çıkış</span>
        </button>
        <button
          className={`nav-item ${currentView === 'stock' ? 'active' : ''}`}
          onClick={() => handleNavigate('stock')}
        >
          <span>📦</span>
          <span>Stok</span>
        </button>
        <button
          className={`nav-item ${currentView === 'report' ? 'active' : ''}`}
          onClick={() => handleNavigate('report')}
        >
          <span>📊</span>
          <span>Rapor</span>
        </button>
      </nav>
    </div>
  );
}

export default App;
