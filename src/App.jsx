import { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";

// ─── FIREBASE CONFIG ──────────────────────────────────────────────────────────
const firebaseConfig = {
  apiKey: "AIzaSyBixO_uMIhQFlDoQ59U2a3kJBAZclZTk50",
  authDomain: "biz-system-da8e5.firebaseapp.com",
  projectId: "biz-system-da8e5",
  storageBucket: "biz-system-da8e5.firebasestorage.app",
  messagingSenderId: "997812296192",
  appId: "1:997812296192:web:e2d27d62dc2d036d07d6e5"
};
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

// ─── FIREBASE HELPERS ─────────────────────────────────────────────────────────
// useFireCollection: real-time listener for a Firestore collection
function useFireCollection(colName) {
  const [data, setData] = useState([]);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    const unsub = onSnapshot(collection(db, colName), snap => {
      const docs = snap.docs.map(d => ({ ...d.data(), _id: d.id }));
      setData(docs);
      setLoaded(true);
    }, () => setLoaded(true));
    return unsub;
  }, [colName]);
  return [data, setData, loaded];
}

async function fireAdd(colName, data) {
  const { _id, ...clean } = data;
  await addDoc(collection(db, colName), { ...clean, _ts: Date.now() });
}
async function fireUpdate(colName, id, data) {
  const { _id, ...clean } = data;
  await updateDoc(doc(db, colName, id), { ...clean, _ts: Date.now() });
}
async function fireDelete(colName, id) {
  await deleteDoc(doc(db, colName, id));
}


// ─── CONFIG ───────────────────────────────────────────────────────────────────
// 管理员账号（用户名 + 密码）
const ADMIN_ACCOUNTS = {
  "javier": "AJForever1205",
};
// 员工账号（用户名 + 密码），用户名可自定义
const MEMBER_ACCOUNTS = {
  "ryan":    { name: "Ryan",    password: "Ryan123" },
  "susan":   { name: "Susan",   password: "Susan123" },
  "chaymae": { name: "Chaymae", password: "Chaymae123" },
  "denny":   { name: "Denny",   password: "Denny123" },
};
// 兼容旧逻辑：提取成员显示名
const MEMBER_PASSWORDS = Object.fromEntries(
  Object.values(MEMBER_ACCOUNTS).map(v => [v.name, v.password])
);
const MEMBERS = Object.keys(MEMBER_PASSWORDS);
const CURRENCIES = ["USD", "EUR", "GBP", "JPY", "AUD", "CAD", "SGD"];
const REGIONS = ["北美", "欧洲", "东南亚", "日韩", "中东", "澳洲", "其他"];
const STATUS_COLORS = {
  "待确认": "#f59e0b", "进行中": "#3b82f6", "已完成": "#10b981", "已取消": "#ef4444",
  "规划中": "#8b5cf6", "开发中": "#3b82f6", "测试中": "#f59e0b", "已上线": "#10b981", "暂停": "#6b7280",
  "潜在": "#f59e0b", "活跃": "#10b981", "沉睡": "#6b7280", "流失": "#ef4444",
};

// ─── SHARED UI ────────────────────────────────────────────────────────────────
function Badge({ status }) {
  const c = STATUS_COLORS[status] || "#6b7280";
  return <span style={{ background: c + "22", color: c, border: `1px solid ${c}44`, padding: "2px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600, whiteSpace: "nowrap" }}>{status}</span>;
}
function Modal({ title, onClose, children }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div style={{ background: "#1a1f2e", border: "1px solid #2d3748", borderRadius: 16, width: "100%", maxWidth: 560, maxHeight: "90vh", overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 24px 0" }}>
          <h3 style={{ color: "#e2e8f0", fontSize: 18, fontWeight: 700, margin: 0 }}>{title}</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#718096", fontSize: 24, cursor: "pointer" }}>×</button>
        </div>
        <div style={{ padding: "16px 24px 24px" }}>{children}</div>
      </div>
    </div>
  );
}
const IS = { width: "100%", background: "#0f1420", border: "1px solid #2d3748", borderRadius: 8, color: "#e2e8f0", padding: "10px 12px", fontSize: 14, outline: "none", boxSizing: "border-box" };
const SS = { ...IS, cursor: "pointer" };
function Field({ label, children }) {
  return <div style={{ marginBottom: 16 }}><label style={{ display: "block", color: "#a0aec0", fontSize: 13, marginBottom: 6, fontWeight: 500 }}>{label}</label>{children}</div>;
}
function Btn({ onClick, children, style = {} }) {
  return <button onClick={onClick} style={{ border: "none", cursor: "pointer", fontWeight: 600, borderRadius: 8, ...style }}>{children}</button>;
}

function DataTable({ headers, rows, onEdit, onDelete, isAdmin }) {
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
        <thead>
          <tr>{headers.map(h => <th key={h} style={{ textAlign: "left", padding: "10px 12px", color: "#718096", fontWeight: 600, fontSize: 12, borderBottom: "1px solid #2d3748", whiteSpace: "nowrap" }}>{h}</th>)}
            <th style={{ padding: "10px 12px", color: "#718096", fontSize: 12, borderBottom: "1px solid #2d3748" }}>操作</th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0
            ? <tr><td colSpan={headers.length + 1} style={{ textAlign: "center", padding: 40, color: "#4a5568" }}>暂无数据，点击右上角添加</td></tr>
            : rows.map((row, i) => (
              <tr key={i} style={{ borderBottom: "1px solid #161b27" }}
                onMouseEnter={e => e.currentTarget.style.background = "#1e2433"}
                onMouseLeave={e => e.currentTarget.style.background = ""}>
                {headers.map(h => <td key={h} style={{ padding: "12px", color: "#cbd5e0", whiteSpace: "nowrap" }}>{h === "状态" ? <Badge status={row[h]} /> : row[h]}</td>)}
                <td style={{ padding: "12px", whiteSpace: "nowrap" }}>
                  {(isAdmin || row._canEdit)
                    ? <><Btn onClick={() => onEdit(i)} style={{ background: "#2d3748", color: "#a0aec0", padding: "4px 10px", fontSize: 12, marginRight: 6 }}>编辑</Btn>
                      <Btn onClick={() => onDelete(i)} style={{ background: "#3d1515", color: "#fc8181", padding: "4px 10px", fontSize: 12 }}>删除</Btn></>
                    : <span style={{ color: "#4a5568", fontSize: 12 }}>无权限</span>}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── LOGIN ────────────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }) {
  const [username, setUsername] = useState("");
  const [pwd, setPwd] = useState("");
  const [err, setErr] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  function login() {
    if (!username.trim() || !pwd) { setErr("请输入用户名和密码"); return; }
    setLoading(true);
    setTimeout(() => {
      const u = username.trim().toLowerCase();
      // 检查管理员
      if (ADMIN_ACCOUNTS[u] !== undefined) {
        if (pwd === ADMIN_ACCOUNTS[u]) { onLogin({ role: "admin", name: "管理员", username: u }); return; }
        else { setErr("用户名或密码错误"); setLoading(false); return; }
      }
      // 检查员工
      const member = MEMBER_ACCOUNTS[u];
      if (member) {
        if (pwd === member.password) { onLogin({ role: "member", name: member.name, username: u }); return; }
        else { setErr("用户名或密码错误"); setLoading(false); return; }
      }
      setErr("用户名不存在");
      setLoading(false);
    }, 400);
  }

  return (
    <div style={{ minHeight: "100vh", background: "#0f1420", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ width: "100%", maxWidth: 400 }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{ width: 68, height: 68, background: "linear-gradient(135deg,#667eea,#764ba2)", borderRadius: 20, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 34, marginBottom: 16, boxShadow: "0 8px 32px #667eea44" }}>🌏</div>
          <h1 style={{ color: "#e2e8f0", fontSize: 24, fontWeight: 800, margin: "0 0 8px" }}>国际业务管理系统</h1>
          <p style={{ color: "#4a5568", fontSize: 14, margin: 0 }}>请输入账号密码登录</p>
        </div>

        <div style={{ background: "#1a1f2e", border: "1px solid #2d3748", borderRadius: 20, padding: 32 }}>
          {/* Username */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", color: "#a0aec0", fontSize: 13, fontWeight: 500, marginBottom: 8 }}>用户名</label>
            <div style={{ position: "relative" }}>
              <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontSize: 16, pointerEvents: "none" }}>👤</span>
              <input
                style={{ ...IS, paddingLeft: 40 }}
                placeholder="输入用户名"
                value={username}
                onChange={e => { setUsername(e.target.value); setErr(""); }}
                onKeyDown={e => e.key === "Enter" && login()}
                autoFocus
              />
            </div>
          </div>

          {/* Password */}
          <div style={{ marginBottom: err ? 8 : 24 }}>
            <label style={{ display: "block", color: "#a0aec0", fontSize: 13, fontWeight: 500, marginBottom: 8 }}>密码</label>
            <div style={{ position: "relative" }}>
              <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontSize: 16, pointerEvents: "none" }}>🔑</span>
              <input
                style={{ ...IS, paddingLeft: 40, paddingRight: 44 }}
                type={show ? "text" : "password"}
                placeholder="输入密码"
                value={pwd}
                onChange={e => { setPwd(e.target.value); setErr(""); }}
                onKeyDown={e => e.key === "Enter" && login()}
              />
              <button onClick={() => setShow(v => !v)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: 16, color: "#718096" }}>{show ? "🙈" : "👁"}</button>
            </div>
          </div>

          {err && <div style={{ color: "#fc8181", fontSize: 13, marginBottom: 16, textAlign: "center", background: "#3d1515", padding: "8px 12px", borderRadius: 8 }}>⚠ {err}</div>}

          <button onClick={login} disabled={loading} style={{ width: "100%", background: loading ? "#4a3f6b" : "linear-gradient(135deg,#667eea,#764ba2)", border: "none", color: "#fff", padding: 14, borderRadius: 10, cursor: loading ? "not-allowed" : "pointer", fontWeight: 700, fontSize: 15, transition: "all 0.2s" }}>
            {loading ? "登录中..." : "登 录"}
          </button>

          {/* 账号提示 */}
          <div style={{ marginTop: 24, padding: "14px 16px", background: "#0f1420", borderRadius: 10, border: "1px solid #1e2433" }}>
            <div style={{ color: "#4a5568", fontSize: 12, marginBottom: 8, fontWeight: 600 }}>💡 账号说明</div>
            <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "4px 12px", fontSize: 12 }}>
              <span style={{ color: "#a78bfa" }}>管理员</span><span style={{ color: "#718096" }}>用户名：Javier</span>
              <span style={{ color: "#718096" }}></span><span style={{ color: "#4a5568" }}>密码：AJForever1205</span>
              <span style={{ color: "#a0aec0", marginTop: 4 }}>员工</span><span style={{ color: "#718096", marginTop: 4 }}>Ryan / Susan / Chaymae / Denny</span>
              <span></span><span style={{ color: "#4a5568" }}>密码：名字 + 123（如 Ryan123）</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── ORDERS ───────────────────────────────────────────────────────────────────
function Orders({ data, setData, user }) {
  const isAdmin = user.role === "admin";
  const [modal, setModal] = useState(false);
  const [editIdx, setEditIdx] = useState(null);
  const [form, setForm] = useState({});
  const empty = { 客户名称: "", 地区: "北美", 金额: "", 货币: "USD", 负责人: isAdmin ? MEMBERS[0] : user.name, 状态: "待确认", 日期: new Date().toISOString().slice(0, 10), 备注: "", _owner: user.name };
  const visible = isAdmin ? data : data.filter(d => d._owner === user.name || d.负责人 === user.name);
  function openEdit(i) { const ri = data.indexOf(visible[i]); setForm({ ...data[ri] }); setEditIdx(ri); setModal(true); }
  async function save() {
    if (!form.客户名称 || !form.金额) return alert("请填写客户名称和金额");
    const f = { ...form, _owner: form._owner || user.name };
    if (editIdx !== null) { await setData(null, "update", f); }
    else { const { _id, ...clean } = f; await setData(null, "add", clean); }
    setModal(false);
  }
  async function del(i) {
    const ri = data.indexOf(visible[i]);
    if (confirm("确认删除？")) await setData(null, "delete", data[ri]);
  }
  const fv = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const headers = isAdmin ? ["客户名称", "地区", "金额", "货币", "负责人", "状态", "日期"] : ["客户名称", "地区", "金额", "货币", "状态", "日期"];
  const rows = visible.map(d => ({ ...d, 金额: Number(d.金额).toLocaleString(), _canEdit: d._owner === user.name }));
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div style={{ color: "#a0aec0", fontSize: 14 }}>{isAdmin ? <><b style={{ color: "#e2e8f0" }}>{data.length}</b> 条（全部）</> : <><b style={{ color: "#e2e8f0" }}>{visible.length}</b> 条我的订单</>}</div>
        <button onClick={() => { setForm(empty); setEditIdx(null); setModal(true); }} style={{ background: "linear-gradient(135deg,#667eea,#764ba2)", border: "none", color: "#fff", padding: "9px 20px", borderRadius: 10, cursor: "pointer", fontWeight: 600, fontSize: 14 }}>+ 新增订单</button>
      </div>
      <DataTable headers={headers} rows={rows} onEdit={openEdit} onDelete={del} isAdmin={isAdmin} />
      {modal && <Modal title={editIdx !== null ? "编辑订单" : "新增订单"} onClose={() => setModal(false)}>
        <Field label="客户名称"><input style={IS} value={form.客户名称} onChange={e => fv("客户名称", e.target.value)} /></Field>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <Field label="地区"><select style={SS} value={form.地区} onChange={e => fv("地区", e.target.value)}>{REGIONS.map(r => <option key={r}>{r}</option>)}</select></Field>
          <Field label="状态"><select style={SS} value={form.状态} onChange={e => fv("状态", e.target.value)}>{["待确认","进行中","已完成","已取消"].map(s => <option key={s}>{s}</option>)}</select></Field>
          <Field label="金额"><input style={IS} type="number" value={form.金额} onChange={e => fv("金额", e.target.value)} /></Field>
          <Field label="货币"><select style={SS} value={form.货币} onChange={e => fv("货币", e.target.value)}>{CURRENCIES.map(c => <option key={c}>{c}</option>)}</select></Field>
          {isAdmin ? <Field label="负责人"><select style={SS} value={form.负责人} onChange={e => fv("负责人", e.target.value)}>{MEMBERS.map(m => <option key={m}>{m}</option>)}</select></Field>
            : <Field label="负责人"><input style={{ ...IS, opacity: 0.6 }} value={user.name} disabled /></Field>}
          <Field label="日期"><input style={IS} type="date" value={form.日期} onChange={e => fv("日期", e.target.value)} /></Field>
        </div>
        <Field label="备注"><textarea style={{ ...IS, resize: "vertical", minHeight: 70 }} value={form.备注} onChange={e => fv("备注", e.target.value)} /></Field>
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 8 }}>
          <Btn onClick={() => setModal(false)} style={{ background: "#2d3748", color: "#a0aec0", padding: "10px 20px" }}>取消</Btn>
          <Btn onClick={save} style={{ background: "linear-gradient(135deg,#667eea,#764ba2)", color: "#fff", padding: "10px 24px" }}>保存</Btn>
        </div>
      </Modal>}
    </div>
  );
}

// ─── DEVELOPMENT ──────────────────────────────────────────────────────────────
function Development({ data, setData, user }) {
  const isAdmin = user.role === "admin";
  const [modal, setModal] = useState(false);
  const [editIdx, setEditIdx] = useState(null);
  const [form, setForm] = useState({});
  const empty = { 项目名称: "", 负责人: isAdmin ? MEMBERS[0] : user.name, 进度: "0", 状态: "规划中", 开始日期: new Date().toISOString().slice(0, 10), 预计完成: "", 描述: "", _owner: user.name };
  const visible = isAdmin ? data : data.filter(d => d._owner === user.name || d.负责人 === user.name);
  function openEdit(i) { const ri = data.indexOf(visible[i]); setForm({ ...data[ri] }); setEditIdx(ri); setModal(true); }
  async function save() {
    if (!form.项目名称) return alert("请填写项目名称");
    const f = { ...form, _owner: form._owner || user.name };
    if (editIdx !== null) { await setData(null, "update", f); }
    else { const { _id, ...clean } = f; await setData(null, "add", clean); }
    setModal(false);
  }
  async function del(i) {
    const ri = data.indexOf(visible[i]);
    if (confirm("确认删除？")) await setData(null, "delete", data[ri]);
  }
  const fv = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const headers = ["项目名称", "负责人", "状态", "进度", "开始日期", "预计完成"];
  const rows = visible.map(d => ({ ...d, 进度: d.进度 + "%", _canEdit: d._owner === user.name }));
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div style={{ color: "#a0aec0", fontSize: 14 }}>{isAdmin ? <><b style={{ color: "#e2e8f0" }}>{data.length}</b> 个（全部）</> : <><b style={{ color: "#e2e8f0" }}>{visible.length}</b> 个我的项目</>}</div>
        <button onClick={() => { setForm(empty); setEditIdx(null); setModal(true); }} style={{ background: "linear-gradient(135deg,#667eea,#764ba2)", border: "none", color: "#fff", padding: "9px 20px", borderRadius: 10, cursor: "pointer", fontWeight: 600, fontSize: 14 }}>+ 新增项目</button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: 16, marginBottom: 24 }}>
        {visible.slice(0, 6).map((d, i) => (
          <div key={i} style={{ background: "#1a1f2e", border: "1px solid #2d3748", borderRadius: 12, padding: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
              <span style={{ color: "#e2e8f0", fontWeight: 600, fontSize: 14 }}>{d.项目名称}</span><Badge status={d.状态} />
            </div>
            <div style={{ fontSize: 12, color: "#718096", marginBottom: 8 }}>负责人：{d.负责人}</div>
            <div style={{ background: "#0f1420", borderRadius: 6, height: 6 }}><div style={{ height: "100%", width: d.进度 + "%", background: "linear-gradient(90deg,#667eea,#764ba2)", borderRadius: 6 }} /></div>
            <div style={{ textAlign: "right", fontSize: 12, color: "#a0aec0", marginTop: 4 }}>{d.进度}%</div>
          </div>
        ))}
      </div>
      <DataTable headers={headers} rows={rows} onEdit={openEdit} onDelete={del} isAdmin={isAdmin} />
      {modal && <Modal title={editIdx !== null ? "编辑项目" : "新增项目"} onClose={() => setModal(false)}>
        <Field label="项目名称"><input style={IS} value={form.项目名称} onChange={e => fv("项目名称", e.target.value)} /></Field>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {isAdmin ? <Field label="负责人"><select style={SS} value={form.负责人} onChange={e => fv("负责人", e.target.value)}>{MEMBERS.map(m => <option key={m}>{m}</option>)}</select></Field>
            : <Field label="负责人"><input style={{ ...IS, opacity: 0.6 }} value={user.name} disabled /></Field>}
          <Field label="状态"><select style={SS} value={form.状态} onChange={e => fv("状态", e.target.value)}>{["规划中","开发中","测试中","已上线","暂停"].map(s => <option key={s}>{s}</option>)}</select></Field>
          <Field label="进度 (%)"><input style={IS} type="number" min="0" max="100" value={form.进度} onChange={e => fv("进度", e.target.value)} /></Field>
          <Field label="开始日期"><input style={IS} type="date" value={form.开始日期} onChange={e => fv("开始日期", e.target.value)} /></Field>
          <Field label="预计完成"><input style={IS} type="date" value={form.预计完成} onChange={e => fv("预计完成", e.target.value)} /></Field>
        </div>
        <Field label="描述"><textarea style={{ ...IS, resize: "vertical", minHeight: 70 }} value={form.描述} onChange={e => fv("描述", e.target.value)} /></Field>
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 8 }}>
          <Btn onClick={() => setModal(false)} style={{ background: "#2d3748", color: "#a0aec0", padding: "10px 20px" }}>取消</Btn>
          <Btn onClick={save} style={{ background: "linear-gradient(135deg,#667eea,#764ba2)", color: "#fff", padding: "10px 24px" }}>保存</Btn>
        </div>
      </Modal>}
    </div>
  );
}

// ─── CLIENTS ──────────────────────────────────────────────────────────────────
function Clients({ data, setData, user }) {
  const isAdmin = user.role === "admin";
  const [modal, setModal] = useState(false);
  const [editIdx, setEditIdx] = useState(null);
  const [form, setForm] = useState({});
  const empty = { 公司名称: "", 联系人: "", 邮箱: "", 地区: "北美", 状态: "潜在", 负责人: isAdmin ? MEMBERS[0] : user.name, 最近联系: new Date().toISOString().slice(0, 10), 备注: "", _owner: user.name };
  const visible = isAdmin ? data : data.filter(d => d._owner === user.name || d.负责人 === user.name);
  function openEdit(i) { const ri = data.indexOf(visible[i]); setForm({ ...data[ri] }); setEditIdx(ri); setModal(true); }
  async function save() {
    if (!form.公司名称) return alert("请填写公司名称");
    const f = { ...form, _owner: form._owner || user.name };
    if (editIdx !== null) { await setData(null, "update", f); }
    else { const { _id, ...clean } = f; await setData(null, "add", clean); }
    setModal(false);
  }
  async function del(i) {
    const ri = data.indexOf(visible[i]);
    if (confirm("确认删除？")) await setData(null, "delete", data[ri]);
  }
  const fv = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const headers = ["公司名称", "联系人", "邮箱", "地区", "状态", "负责人", "最近联系"];
  const rows = visible.map(d => ({ ...d, _canEdit: d._owner === user.name }));
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div style={{ color: "#a0aec0", fontSize: 14 }}>{isAdmin ? <><b style={{ color: "#e2e8f0" }}>{data.length}</b> 个（全部）</> : <><b style={{ color: "#e2e8f0" }}>{visible.length}</b> 个我的客户</>}</div>
        <button onClick={() => { setForm(empty); setEditIdx(null); setModal(true); }} style={{ background: "linear-gradient(135deg,#667eea,#764ba2)", border: "none", color: "#fff", padding: "9px 20px", borderRadius: 10, cursor: "pointer", fontWeight: 600, fontSize: 14 }}>+ 新增客户</button>
      </div>
      <DataTable headers={headers} rows={rows} onEdit={openEdit} onDelete={del} isAdmin={isAdmin} />
      {modal && <Modal title={editIdx !== null ? "编辑客户" : "新增客户"} onClose={() => setModal(false)}>
        <Field label="公司名称"><input style={IS} value={form.公司名称} onChange={e => fv("公司名称", e.target.value)} /></Field>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <Field label="联系人"><input style={IS} value={form.联系人} onChange={e => fv("联系人", e.target.value)} /></Field>
          <Field label="邮箱"><input style={IS} type="email" value={form.邮箱} onChange={e => fv("邮箱", e.target.value)} /></Field>
          <Field label="地区"><select style={SS} value={form.地区} onChange={e => fv("地区", e.target.value)}>{REGIONS.map(r => <option key={r}>{r}</option>)}</select></Field>
          <Field label="状态"><select style={SS} value={form.状态} onChange={e => fv("状态", e.target.value)}>{["潜在","活跃","沉睡","流失"].map(s => <option key={s}>{s}</option>)}</select></Field>
          {isAdmin ? <Field label="负责人"><select style={SS} value={form.负责人} onChange={e => fv("负责人", e.target.value)}>{MEMBERS.map(m => <option key={m}>{m}</option>)}</select></Field>
            : <Field label="负责人"><input style={{ ...IS, opacity: 0.6 }} value={user.name} disabled /></Field>}
          <Field label="最近联系"><input style={IS} type="date" value={form.最近联系} onChange={e => fv("最近联系", e.target.value)} /></Field>
        </div>
        <Field label="备注"><textarea style={{ ...IS, resize: "vertical", minHeight: 70 }} value={form.备注} onChange={e => fv("备注", e.target.value)} /></Field>
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 8 }}>
          <Btn onClick={() => setModal(false)} style={{ background: "#2d3748", color: "#a0aec0", padding: "10px 20px" }}>取消</Btn>
          <Btn onClick={save} style={{ background: "linear-gradient(135deg,#667eea,#764ba2)", color: "#fff", padding: "10px 24px" }}>保存</Btn>
        </div>
      </Modal>}
    </div>
  );
}

// ─── REPORTS ──────────────────────────────────────────────────────────────────
function Reports({ data, setData, user }) {
  const isAdmin = user.role === "admin";
  const [modal, setModal] = useState(false);
  const [editIdx, setEditIdx] = useState(null);
  const [form, setForm] = useState({});
  const empty = { 成员: user.name, 日期: new Date().toISOString().slice(0, 10), 本周完成: "", 下周计划: "", 遇到问题: "", 类型: "周报", _owner: user.name };
  function openEdit(i) { setForm({ ...data[i] }); setEditIdx(i); setModal(true); }
  async function save() {
    if (!form.本周完成) return alert("请填写本期完成内容");
    const f = { ...form, _owner: form._owner || user.name };
    if (editIdx !== null) { await setData(null, "update", f); }
    else { const { _id, ...clean } = f; await setData(null, "add", clean); }
    setModal(false);
  }
  async function del(i) {
    if (confirm("确认删除？")) await setData(null, "delete", data[i]);
  }
  const fv = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const canEdit = (d) => isAdmin || d._owner === user.name;
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <div style={{ color: "#a0aec0", fontSize: 14 }}><b style={{ color: "#e2e8f0" }}>{data.length}</b> 份汇报</div>
        <button onClick={() => { setForm(empty); setEditIdx(null); setModal(true); }} style={{ background: "linear-gradient(135deg,#667eea,#764ba2)", border: "none", color: "#fff", padding: "9px 20px", borderRadius: 10, cursor: "pointer", fontWeight: 600, fontSize: 14 }}>+ 提交汇报</button>
      </div>
      <div style={{ color: "#4a5568", fontSize: 12, marginBottom: 20 }}>📢 汇报全员可见，仅可编辑自己的</div>
      <div style={{ display: "grid", gap: 16 }}>
        {data.length === 0 && <div style={{ textAlign: "center", padding: 40, color: "#4a5568" }}>暂无汇报</div>}
        {data.map((d, i) => (
          <div key={i} style={{ background: "#1a1f2e", border: "1px solid #2d3748", borderRadius: 12, padding: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
              <div>
                <span style={{ color: "#e2e8f0", fontWeight: 700, fontSize: 15 }}>{d.成员}</span>
                <span style={{ color: "#718096", fontSize: 13, marginLeft: 10 }}>{d.类型} · {d.日期}</span>
                {d._owner === user.name && <span style={{ marginLeft: 8, background: "#667eea22", color: "#a78bfa", fontSize: 11, padding: "2px 8px", borderRadius: 10 }}>我的</span>}
              </div>
              {canEdit(d) && <div style={{ display: "flex", gap: 8 }}>
                <Btn onClick={() => openEdit(i)} style={{ background: "#2d3748", color: "#a0aec0", padding: "4px 12px", fontSize: 12 }}>编辑</Btn>
                <Btn onClick={() => del(i)} style={{ background: "#3d1515", color: "#fc8181", padding: "4px 12px", fontSize: 12 }}>删除</Btn>
              </div>}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div><div style={{ color: "#718096", fontSize: 12, marginBottom: 6 }}>✅ 本期完成</div><div style={{ color: "#cbd5e0", fontSize: 14, lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{d.本周完成}</div></div>
              <div><div style={{ color: "#718096", fontSize: 12, marginBottom: 6 }}>📋 下期计划</div><div style={{ color: "#cbd5e0", fontSize: 14, lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{d.下周计划}</div></div>
            </div>
            {d.遇到问题 && <div style={{ marginTop: 12, background: "#2d1a1a", borderRadius: 8, padding: "10px 14px" }}><div style={{ color: "#fc8181", fontSize: 12, marginBottom: 4 }}>⚠️ 问题</div><div style={{ color: "#fbb6b6", fontSize: 14, whiteSpace: "pre-wrap" }}>{d.遇到问题}</div></div>}
          </div>
        ))}
      </div>
      {modal && <Modal title={editIdx !== null ? "编辑汇报" : "提交工作汇报"} onClose={() => setModal(false)}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <Field label="成员"><input style={{ ...IS, opacity: isAdmin ? 1 : 0.6 }} value={form.成员} disabled={!isAdmin} onChange={e => fv("成员", e.target.value)} /></Field>
          <Field label="类型"><select style={SS} value={form.类型} onChange={e => fv("类型", e.target.value)}>{["日报","周报","月报"].map(t => <option key={t}>{t}</option>)}</select></Field>
          <Field label="日期"><input style={IS} type="date" value={form.日期} onChange={e => fv("日期", e.target.value)} /></Field>
        </div>
        <Field label="本期完成 *"><textarea style={{ ...IS, resize: "vertical", minHeight: 90 }} value={form.本周完成} onChange={e => fv("本周完成", e.target.value)} placeholder="描述本期完成的工作..." /></Field>
        <Field label="下期计划"><textarea style={{ ...IS, resize: "vertical", minHeight: 80 }} value={form.下周计划} onChange={e => fv("下周计划", e.target.value)} /></Field>
        <Field label="遇到问题 / 需要支持"><textarea style={{ ...IS, resize: "vertical", minHeight: 70 }} value={form.遇到问题} onChange={e => fv("遇到问题", e.target.value)} /></Field>
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 8 }}>
          <Btn onClick={() => setModal(false)} style={{ background: "#2d3748", color: "#a0aec0", padding: "10px 20px" }}>取消</Btn>
          <Btn onClick={save} style={{ background: "linear-gradient(135deg,#667eea,#764ba2)", color: "#fff", padding: "10px 24px" }}>提交</Btn>
        </div>
      </Modal>}
    </div>
  );
}

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
function Dashboard({ orders, devs, clients, reports }) {
  const done = orders.filter(o => o.状态 === "已完成");
  const total = done.reduce((s, o) => s + Number(o.金额 || 0), 0);
  const regionData = REGIONS.map(r => ({ name: r, amt: orders.filter(o => o.地区 === r).reduce((s, o) => s + Number(o.金额 || 0), 0) })).filter(r => r.amt > 0).sort((a, b) => b.amt - a.amt);
  const maxAmt = Math.max(...regionData.map(r => r.amt), 1);
  const perf = MEMBERS.map(m => ({ name: m, n: orders.filter(o => o.负责人 === m).length, d: orders.filter(o => o.负责人 === m && o.状态 === "已完成").length })).filter(m => m.n > 0).sort((a, b) => b.n - a.n);
  const Card = ({ label, value, sub, color }) => (
    <div style={{ background: "#1a1f2e", border: "1px solid #2d3748", borderRadius: 14, padding: "20px 24px" }}>
      <div style={{ color: "#718096", fontSize: 13, marginBottom: 8 }}>{label}</div>
      <div style={{ color: color || "#e2e8f0", fontSize: 28, fontWeight: 800 }}>{value}</div>
      {sub && <div style={{ color: "#4a5568", fontSize: 12, marginTop: 4 }}>{sub}</div>}
    </div>
  );
  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(180px,1fr))", gap: 16, marginBottom: 28 }}>
        <Card label="累计成交金额" value={total.toLocaleString()} sub="已完成订单" color="#10b981" />
        <Card label="进行中订单" value={orders.filter(o => o.状态 === "进行中").length} sub={`共 ${orders.length} 条`} color="#3b82f6" />
        <Card label="活跃客户" value={clients.filter(c => c.状态 === "活跃").length} sub={`共 ${clients.length} 个`} color="#f59e0b" />
        <Card label="已上线项目" value={devs.filter(d => d.状态 === "已上线").length} sub={`共 ${devs.length} 个`} color="#8b5cf6" />
        <Card label="工作汇报" value={reports.length} color="#ec4899" />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
        <div style={{ background: "#1a1f2e", border: "1px solid #2d3748", borderRadius: 14, padding: 20 }}>
          <h4 style={{ color: "#e2e8f0", margin: "0 0 16px", fontSize: 15 }}>📊 地区销售分布</h4>
          {regionData.length === 0 ? <div style={{ color: "#4a5568", textAlign: "center", padding: 20 }}>暂无数据</div> : regionData.map(r => (
            <div key={r.name} style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}><span style={{ color: "#a0aec0", fontSize: 13 }}>{r.name}</span><span style={{ color: "#e2e8f0", fontSize: 13, fontWeight: 600 }}>{r.amt.toLocaleString()}</span></div>
              <div style={{ background: "#0f1420", borderRadius: 6, height: 8 }}><div style={{ height: "100%", width: (r.amt / maxAmt * 100) + "%", background: "linear-gradient(90deg,#667eea,#764ba2)", borderRadius: 6 }} /></div>
            </div>
          ))}
        </div>
        <div style={{ background: "#1a1f2e", border: "1px solid #2d3748", borderRadius: 14, padding: 20 }}>
          <h4 style={{ color: "#e2e8f0", margin: "0 0 16px", fontSize: 15 }}>👥 成员业绩排行</h4>
          {perf.length === 0 ? <div style={{ color: "#4a5568", textAlign: "center", padding: 20 }}>暂无数据</div> : perf.slice(0, 6).map((m, i) => (
            <div key={m.name} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12, padding: "8px 12px", background: i === 0 ? "#1e2a1e" : "", borderRadius: 8 }}>
              <span style={{ color: ["#f59e0b","#9ca3af","#cd7f32"][i] || "#4a5568", fontWeight: 800, fontSize: 16, width: 24, textAlign: "center" }}>{i + 1}</span>
              <span style={{ color: "#e2e8f0", flex: 1, fontSize: 14 }}>{m.name}</span>
              <span style={{ color: "#a0aec0", fontSize: 13 }}>{m.n} 单</span>
              <span style={{ color: "#10b981", fontSize: 13 }}>✓ {m.d}</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{ background: "#1a1f2e", border: "1px solid #2d3748", borderRadius: 14, padding: 20 }}>
        <h4 style={{ color: "#e2e8f0", margin: "0 0 16px", fontSize: 15 }}>🔥 订单状态概览</h4>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          {["待确认","进行中","已完成","已取消"].map(s => {
            const cnt = orders.filter(o => o.状态 === s).length;
            const pct = orders.length ? Math.round(cnt / orders.length * 100) : 0;
            return (
              <div key={s} style={{ flex: "1 1 120px", background: "#0f1420", borderRadius: 10, padding: "14px 18px", textAlign: "center" }}>
                <Badge status={s} />
                <div style={{ color: "#e2e8f0", fontSize: 28, fontWeight: 800, margin: "10px 0 4px" }}>{cnt}</div>
                <div style={{ color: "#4a5568", fontSize: 12 }}>{pct}%</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── APP ──────────────────────────────────────────────────────────────────────
const TABS = ["销售订单","开发进度","客户管理","工作汇报","数据看板"];
const ICONS = ["📦","🚀","👥","📝","📊"];

export default function App() {
  const [user, setUser] = useState(null);
  const [tab, setTab] = useState(0);

  // Real-time Firebase collections
  const [orders,  , ordersLoaded]  = useFireCollection("orders");
  const [devs,    , devsLoaded]    = useFireCollection("devs");
  const [clients, , clientsLoaded] = useFireCollection("clients");
  const [reports, , reportsLoaded] = useFireCollection("reports");

  const loaded = ordersLoaded && devsLoaded && clientsLoaded && reportsLoaded;

  // Write helpers — these talk directly to Firestore
  const upOrders  = async (newData, action, item) => { await syncToFirestore("orders",  orders,  newData, action, item); };
  const upDevs    = async (newData, action, item) => { await syncToFirestore("devs",    devs,    newData, action, item); };
  const upClients = async (newData, action, item) => { await syncToFirestore("clients", clients, newData, action, item); };
  const upReports = async (newData, action, item) => { await syncToFirestore("reports", reports, newData, action, item); };

  async function syncToFirestore(col, oldData, newData, action, item) {
    if (action === "add")    { await fireAdd(col, item); return; }
    if (action === "update") { await fireUpdate(col, item._id, item); return; }
    if (action === "delete") { await fireDelete(col, item._id); return; }
    // Fallback: diff old vs new
    if (newData.length > oldData.length) {
      const added = newData.find(n => !oldData.some(o => o._id === n._id));
      if (added) await fireAdd(col, added);
    } else if (newData.length < oldData.length) {
      const removed = oldData.find(o => !newData.some(n => n._id === o._id));
      if (removed) await fireDelete(col, removed._id);
    }
  }

  if (!loaded) return <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", background: "#0f1420", color: "#718096" }}>加载中...</div>;
  if (!user) return <LoginScreen onLogin={u => { setUser(u); setTab(0); }} />;

  const isAdmin = user.role === "admin";
  const tabs = isAdmin ? TABS : TABS.slice(0, 4);

  return (
    <div style={{ minHeight: "100vh", background: "#0f1420", fontFamily: "'Noto Sans SC', system-ui, sans-serif" }}>
      <div style={{ background: "#0d1117", borderBottom: "1px solid #1e2433" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 60 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 32, height: 32, background: "linear-gradient(135deg,#667eea,#764ba2)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🌏</div>
              <span style={{ color: "#e2e8f0", fontWeight: 700, fontSize: 18 }}>国际业务管理系统</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#1a1f2e", border: "1px solid #2d3748", borderRadius: 10, padding: "6px 14px" }}>
                <span style={{ fontSize: 16 }}>{isAdmin ? "👑" : "👤"}</span>
                <span style={{ color: "#e2e8f0", fontSize: 14, fontWeight: 600 }}>{user.name}</span>
                <span style={{ background: isAdmin ? "#764ba222" : "#2d3748", color: isAdmin ? "#a78bfa" : "#718096", fontSize: 11, padding: "2px 8px", borderRadius: 8, fontWeight: 600 }}>{isAdmin ? "管理员" : "员工"}</span>
              </div>
              <button onClick={() => { setUser(null); setTab(0); }} style={{ background: "#2d3748", border: "none", color: "#a0aec0", padding: "8px 14px", borderRadius: 8, cursor: "pointer", fontSize: 13 }}>退出</button>
            </div>
          </div>
          <div style={{ display: "flex", gap: 4 }}>
            {tabs.map((t, i) => (
              <button key={t} onClick={() => setTab(i)} style={{ background: "none", border: "none", cursor: "pointer", padding: "12px 18px", fontSize: 14, fontWeight: tab === i ? 700 : 400, color: tab === i ? "#a78bfa" : "#718096", borderBottom: tab === i ? "2px solid #a78bfa" : "2px solid transparent", transition: "all 0.2s" }}>
                {ICONS[i]} {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {!isAdmin && (
        <div style={{ background: "#15101e", borderBottom: "1px solid #251c35" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto", padding: "8px 24px", color: "#7c3aed", fontSize: 12 }}>
            🔒 员工视图 — 订单 / 项目 / 客户 仅显示你的数据；工作汇报全员可见
          </div>
        </div>
      )}

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "28px 24px" }}>
        {tab === 0 && <Orders data={orders} setData={upOrders} user={user} />}
        {tab === 1 && <Development data={devs} setData={upDevs} user={user} />}
        {tab === 2 && <Clients data={clients} setData={upClients} user={user} />}
        {tab === 3 && <Reports data={reports} setData={upReports} user={user} />}
        {tab === 4 && isAdmin && <Dashboard orders={orders} devs={devs} clients={clients} reports={reports} />}
      </div>
    </div>
  );
}
