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
const ALL_MEMBERS = ["Javier", ...MEMBERS]; // 包含管理员 Javier
const CURRENCIES = ["USD", "EUR", "GBP", "JPY", "AUD", "CAD", "SGD"];
const REGIONS = ["北美", "南美", "欧洲", "东南亚", "日韩", "中东", "南亚", "非洲", "中亚/东欧", "澳洲", "其他"];
const COUNTRIES_BY_REGION = {
  "北美": ["美国", "加拿大", "墨西哥", "古巴", "多米尼加", "牙买加", "海地", "巴拿马", "哥斯达黎加", "危地马拉", "洪都拉斯", "萨尔瓦多", "尼加拉瓜", "伯利兹", "波多黎各", "其他北美"],
  "南美": ["巴西", "阿根廷", "智利", "哥伦比亚", "秘鲁", "委内瑞拉", "厄瓜多尔", "乌拉圭", "玻利维亚", "巴拉圭", "圭亚那", "苏里南", "特立尼达和多巴哥", "其他南美"],
  "欧洲": ["英国", "德国", "法国", "西班牙", "意大利", "荷兰", "比利时", "葡萄牙", "瑞士", "奥地利", "瑞典", "挪威", "丹麦", "芬兰", "冰岛", "波兰", "捷克", "斯洛伐克", "匈牙利", "罗马尼亚", "保加利亚", "克罗地亚", "塞尔维亚", "希腊", "爱尔兰", "卢森堡", "立陶宛", "拉脱维亚", "爱沙尼亚", "斯洛文尼亚", "北马其顿", "阿尔巴尼亚", "其他欧洲"],
  "东南亚": ["越南", "泰国", "印度尼西亚", "马来西亚", "菲律宾", "新加坡", "缅甸", "柬埔寨", "老挝", "文莱", "东帝汶", "其他东南亚"],
  "日韩": ["日本", "韩国", "台湾", "香港", "澳门"],
  "中东": ["阿联酋", "沙特阿拉伯", "土耳其", "以色列", "卡塔尔", "科威特", "巴林", "阿曼", "约旦", "伊拉克", "伊朗", "黎巴嫩", "叙利亚", "也门", "巴勒斯坦", "其他中东"],
  "南亚": ["印度", "巴基斯坦", "孟加拉国", "斯里兰卡", "尼泊尔", "不丹", "马尔代夫", "其他南亚"],
  "非洲": ["南非", "尼日利亚", "肯尼亚", "埃塞俄比亚", "加纳", "坦桑尼亚", "乌干达", "卢旺达", "摩洛哥", "突尼斯", "阿尔及利亚", "利比亚", "埃及", "安哥拉", "莫桑比克", "津巴布韦", "赞比亚", "象牙海岸", "喀麦隆", "塞内加尔", "其他非洲"],
  "中亚/东欧": ["俄罗斯", "乌克兰", "哈萨克斯坦", "乌兹别克斯坦", "土库曼斯坦", "吉尔吉斯斯坦", "塔吉克斯坦", "格鲁吉亚", "亚美尼亚", "阿塞拜疆", "白俄罗斯", "摩尔多瓦", "其他中亚/东欧"],
  "澳洲": ["澳大利亚", "新西兰", "巴布亚新几内亚", "斐济", "所罗门群岛", "瓦努阿图", "萨摩亚", "其他大洋洲"],
  "其他": ["中国大陆", "蒙古", "朝鲜", "其他国家"],
};
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
          <div style={{ marginBottom: 20 }}>
            <img src="data:image/png;base64,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" alt="FLOWCOLOUR" style={{ height: 100, objectFit: "contain" }} />
          </div>
          <h1 style={{ color: "#e2e8f0", fontSize: 20, fontWeight: 800, margin: "0 0 8px" }}>煦彩国际业务销售管理系统（测试）</h1>
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
  const [pdfViewer, setPdfViewer] = useState(null); // { name, url }

  const defaultOwner = user.role === "admin" ? "Javier" : user.name;
  const empty = { 客户名称: "", 地区: "北美", 国家: "美国", 金额: "", 成本: "", 货币: "USD", 负责人: defaultOwner, 状态: "待确认", 日期: new Date().toISOString().slice(0, 10), 备注: "", pdf名称: "", pdf数据: "", _owner: user.name };
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

  function handlePdfUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    if (file.type !== "application/pdf") return alert("请选择 PDF 文件");
    if (file.size > 5 * 1024 * 1024) return alert("PDF 文件不能超过 5MB");
    const reader = new FileReader();
    reader.onload = ev => {
      fv("pdf数据", ev.target.result);
      fv("pdf名称", file.name);
    };
    reader.readAsDataURL(file);
  }

  // Profit calculation
  const profit = (form) => {
    const s = Number(form.金额 || 0);
    const c = Number(form.成本 || 0);
    if (!s) return null;
    const p = s - c;
    const pct = c > 0 ? ((p / s) * 100).toFixed(1) : null;
    return { profit: p, pct, isPositive: p >= 0 };
  };

  const headers = isAdmin
    ? ["客户名称", "地区", "国家", "销售额", "成本", "利润", "货币", "负责人", "状态", "日期", "报价"]
    : ["客户名称", "地区", "国家", "销售额", "成本", "利润", "货币", "状态", "日期", "报价"];

  const rows = visible.map(d => {
    const s = Number(d.金额 || 0);
    const c = Number(d.成本 || 0);
    const prof = s - c;
    const pct = s > 0 ? ((prof / s) * 100).toFixed(1) : "-";
    const profColor = prof >= 0 ? "#10b981" : "#ef4444";
    return {
      ...d,
      销售额: Number(d.金额 || 0).toLocaleString(),
      成本: Number(d.成本 || 0).toLocaleString(),
      利润: s ? <span style={{ color: profColor, fontWeight: 600 }}>{prof.toLocaleString()} <span style={{ fontSize: 11, opacity: 0.8 }}>({pct}%)</span></span> : "-",
      报价: d.pdf数据 ? <button onClick={e => { e.stopPropagation(); setPdfViewer({ name: d.pdf名称, url: d.pdf数据 }); }} style={{ background: "#667eea22", border: "1px solid #667eea44", color: "#a78bfa", padding: "3px 10px", borderRadius: 6, cursor: "pointer", fontSize: 12 }}>📄 查看</button> : <span style={{ color: "#4a5568", fontSize: 12 }}>—</span>,
      _canEdit: d._owner === user.name,
    };
  });

  const pr = profit(form);
  const countries = COUNTRIES_BY_REGION[form.地区] || ["其他"];

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div style={{ color: "#a0aec0", fontSize: 14 }}>{isAdmin ? <><b style={{ color: "#e2e8f0" }}>{data.length}</b> 条（全部）</> : <><b style={{ color: "#e2e8f0" }}>{visible.length}</b> 条我的订单</>}</div>
        <button onClick={() => { setForm(empty); setEditIdx(null); setModal(true); }} style={{ background: "linear-gradient(135deg,#667eea,#764ba2)", border: "none", color: "#fff", padding: "9px 20px", borderRadius: 10, cursor: "pointer", fontWeight: 600, fontSize: 14 }}>+ 新增订单</button>
      </div>
      <DataTable headers={headers} rows={rows} onEdit={openEdit} onDelete={del} isAdmin={isAdmin} />

      {/* PDF Viewer Modal */}
      {pdfViewer && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 2000, display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 20px", background: "#1a1f2e", borderBottom: "1px solid #2d3748" }}>
            <span style={{ color: "#e2e8f0", fontWeight: 600 }}>📄 {pdfViewer.name}</span>
            <button onClick={() => setPdfViewer(null)} style={{ background: "#3d1515", border: "none", color: "#fc8181", padding: "6px 14px", borderRadius: 8, cursor: "pointer", fontWeight: 600 }}>✕ 关闭</button>
          </div>
          <iframe src={pdfViewer.url} style={{ flex: 1, border: "none" }} title="PDF Viewer" />
        </div>
      )}

      {modal && <Modal title={editIdx !== null ? "编辑订单" : "新增订单"} onClose={() => setModal(false)}>
        <Field label="客户名称"><input style={IS} value={form.客户名称} onChange={e => fv("客户名称", e.target.value)} placeholder="输入客户名称" /></Field>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <Field label="地区"><select style={SS} value={form.地区} onChange={e => { fv("地区", e.target.value); fv("国家", (COUNTRIES_BY_REGION[e.target.value] || ["其他"])[0]); }}>{REGIONS.map(r => <option key={r}>{r}</option>)}</select></Field>
          <Field label="国家"><select style={SS} value={form.国家} onChange={e => fv("国家", e.target.value)}>{countries.map(c => <option key={c}>{c}</option>)}</select></Field>
          <Field label="状态"><select style={SS} value={form.状态} onChange={e => fv("状态", e.target.value)}>{["待确认","进行中","已完成","已取消"].map(s => <option key={s}>{s}</option>)}</select></Field>
          <Field label="货币"><select style={SS} value={form.货币} onChange={e => fv("货币", e.target.value)}>{CURRENCIES.map(c => <option key={c}>{c}</option>)}</select></Field>
          <Field label="销售金额"><input style={IS} type="number" value={form.金额} onChange={e => fv("金额", e.target.value)} placeholder="0" /></Field>
          <Field label="销售成本"><input style={IS} type="number" value={form.成本} onChange={e => fv("成本", e.target.value)} placeholder="0（可选）" /></Field>
          <Field label="负责人"><select style={SS} value={form.负责人} onChange={e => fv("负责人", e.target.value)}>{ALL_MEMBERS.map(m => <option key={m}>{m}</option>)}</select></Field>
          <Field label="日期"><input style={IS} type="date" value={form.日期} onChange={e => fv("日期", e.target.value)} /></Field>
        </div>

        {/* Profit preview */}
        {pr && (
          <div style={{ background: pr.isPositive ? "#0d2618" : "#2d1515", border: `1px solid ${pr.isPositive ? "#10b98133" : "#ef444433"}`, borderRadius: 10, padding: "12px 16px", marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ color: "#718096", fontSize: 13 }}>预估利润</span>
              <span style={{ color: pr.isPositive ? "#10b981" : "#ef4444", fontWeight: 700, fontSize: 18 }}>
                {pr.profit.toLocaleString()} {form.货币}
                {pr.pct && <span style={{ fontSize: 13, marginLeft: 8, opacity: 0.8 }}>({pr.pct}%)</span>}
              </span>
            </div>
          </div>
        )}

        <Field label="备注"><textarea style={{ ...IS, resize: "vertical", minHeight: 60 }} value={form.备注} onChange={e => fv("备注", e.target.value)} /></Field>

        {/* PDF Upload */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", color: "#a0aec0", fontSize: 13, marginBottom: 6, fontWeight: 500 }}>报价 PDF（最大 5MB）</label>
          {form.pdf数据 ? (
            <div style={{ display: "flex", alignItems: "center", gap: 10, background: "#0f1420", border: "1px solid #2d3748", borderRadius: 8, padding: "10px 14px" }}>
              <span style={{ color: "#a78bfa", fontSize: 14 }}>📄 {form.pdf名称}</span>
              <button onClick={() => { fv("pdf数据", ""); fv("pdf名称", ""); }} style={{ marginLeft: "auto", background: "#3d1515", border: "none", color: "#fc8181", padding: "3px 10px", borderRadius: 6, cursor: "pointer", fontSize: 12 }}>删除</button>
            </div>
          ) : (
            <label style={{ display: "flex", alignItems: "center", gap: 10, background: "#0f1420", border: "2px dashed #2d3748", borderRadius: 8, padding: "14px", cursor: "pointer" }}>
              <span style={{ fontSize: 24 }}>📎</span>
              <span style={{ color: "#718096", fontSize: 13 }}>点击上传 PDF 报价单</span>
              <input type="file" accept=".pdf" onChange={handlePdfUpload} style={{ display: "none" }} />
            </label>
          )}
        </div>

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
  const defaultOwner = user.role === "admin" ? "Javier" : user.name;
  const empty = { 客户名称: "", 地区: "北美", 国家: "美国", 负责人: defaultOwner, 进度: "0", 状态: "规划中", 开始日期: new Date().toISOString().slice(0, 10), 预计完成: "", 描述: "", _owner: user.name };
  const visible = isAdmin ? data : data.filter(d => d._owner === user.name || d.负责人 === user.name);
  function openEdit(i) { const ri = data.indexOf(visible[i]); setForm({ ...data[ri] }); setEditIdx(ri); setModal(true); }
  async function save() {
    if (!form.客户名称) return alert("请填写客户名称");
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
  const headers = ["客户名称", "地区", "国家", "负责人", "状态", "进度", "开始日期", "预计完成"];
  const rows = visible.map(d => ({ ...d, 进度: d.进度 + "%", _canEdit: d._owner === user.name }));
  const countries = COUNTRIES_BY_REGION[form.地区] || ["其他"];
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div style={{ color: "#a0aec0", fontSize: 14 }}>{isAdmin ? <><b style={{ color: "#e2e8f0" }}>{data.length}</b> 个（全部）</> : <><b style={{ color: "#e2e8f0" }}>{visible.length}</b> 个我的项目</>}</div>
        <button onClick={() => { setForm(empty); setEditIdx(null); setModal(true); }} style={{ background: "linear-gradient(135deg,#667eea,#764ba2)", border: "none", color: "#fff", padding: "9px 20px", borderRadius: 10, cursor: "pointer", fontWeight: 600, fontSize: 14 }}>+ 新增项目</button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: 16, marginBottom: 24 }}>
        {visible.slice(0, 6).map((d, i) => (
          <div key={i} style={{ background: "#1a1f2e", border: "1px solid #2d3748", borderRadius: 12, padding: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ color: "#e2e8f0", fontWeight: 600, fontSize: 14 }}>{d.客户名称}</span><Badge status={d.状态} />
            </div>
            <div style={{ fontSize: 12, color: "#718096", marginBottom: 2 }}>📍 {d.地区}{d.国家 ? ` · ${d.国家}` : ""}</div>
            <div style={{ fontSize: 12, color: "#718096", marginBottom: 8 }}>负责人：{d.负责人}</div>
            <div style={{ background: "#0f1420", borderRadius: 6, height: 6 }}><div style={{ height: "100%", width: (d.进度 || 0) + "%", background: "linear-gradient(90deg,#667eea,#764ba2)", borderRadius: 6 }} /></div>
            <div style={{ textAlign: "right", fontSize: 12, color: "#a0aec0", marginTop: 4 }}>{d.进度}%</div>
          </div>
        ))}
      </div>
      <DataTable headers={headers} rows={rows} onEdit={openEdit} onDelete={del} isAdmin={isAdmin} />
      {modal && <Modal title={editIdx !== null ? "编辑项目" : "新增项目"} onClose={() => setModal(false)}>
        <Field label="客户名称"><input style={IS} value={form.客户名称} onChange={e => fv("客户名称", e.target.value)} placeholder="输入客户名称" /></Field>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <Field label="地区"><select style={SS} value={form.地区} onChange={e => { fv("地区", e.target.value); fv("国家", (COUNTRIES_BY_REGION[e.target.value] || ["其他"])[0]); }}>{REGIONS.map(r => <option key={r}>{r}</option>)}</select></Field>
          <Field label="国家"><select style={SS} value={form.国家} onChange={e => fv("国家", e.target.value)}>{countries.map(c => <option key={c}>{c}</option>)}</select></Field>
          <Field label="负责人"><select style={SS} value={form.负责人} onChange={e => fv("负责人", e.target.value)}>{ALL_MEMBERS.map(m => <option key={m}>{m}</option>)}</select></Field>
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
  const defaultOwner = user.role === "admin" ? "Javier" : user.name;
  const empty = { 公司名称: "", 联系人: "", 邮箱: "", 地区: "北美", 国家: "美国", 状态: "潜在", 负责人: defaultOwner, 最近联系: new Date().toISOString().slice(0, 10), 备注: "", _owner: user.name };
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
  const headers = ["公司名称", "联系人", "邮箱", "地区", "国家", "状态", "负责人", "最近联系"];
  const rows = visible.map(d => ({ ...d, _canEdit: d._owner === user.name }));
  const countries = COUNTRIES_BY_REGION[form.地区] || ["其他国家"];
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div style={{ color: "#a0aec0", fontSize: 14 }}>{isAdmin ? <><b style={{ color: "#e2e8f0" }}>{data.length}</b> 个（全部）</> : <><b style={{ color: "#e2e8f0" }}>{visible.length}</b> 个我的客户</>}</div>
        <button onClick={() => { setForm(empty); setEditIdx(null); setModal(true); }} style={{ background: "linear-gradient(135deg,#667eea,#764ba2)", border: "none", color: "#fff", padding: "9px 20px", borderRadius: 10, cursor: "pointer", fontWeight: 600, fontSize: 14 }}>+ 新增客户</button>
      </div>
      <DataTable headers={headers} rows={rows} onEdit={openEdit} onDelete={del} isAdmin={isAdmin} />
      {modal && <Modal title={editIdx !== null ? "编辑客户" : "新增客户"} onClose={() => setModal(false)}>
        <Field label="公司名称"><input style={IS} value={form.公司名称} onChange={e => fv("公司名称", e.target.value)} placeholder="输入公司名称" /></Field>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <Field label="联系人"><input style={IS} value={form.联系人} onChange={e => fv("联系人", e.target.value)} /></Field>
          <Field label="邮箱"><input style={IS} type="email" value={form.邮箱} onChange={e => fv("邮箱", e.target.value)} /></Field>
          <Field label="地区"><select style={SS} value={form.地区} onChange={e => { fv("地区", e.target.value); fv("国家", (COUNTRIES_BY_REGION[e.target.value] || ["其他国家"])[0]); }}>{REGIONS.map(r => <option key={r}>{r}</option>)}</select></Field>
          <Field label="国家"><select style={SS} value={form.国家} onChange={e => fv("国家", e.target.value)}>{countries.map(c => <option key={c}>{c}</option>)}</select></Field>
          <Field label="状态"><select style={SS} value={form.状态} onChange={e => fv("状态", e.target.value)}>{["潜在","活跃","沉睡","流失"].map(s => <option key={s}>{s}</option>)}</select></Field>
          <Field label="负责人"><select style={SS} value={form.负责人} onChange={e => fv("负责人", e.target.value)}>{ALL_MEMBERS.map(m => <option key={m}>{m}</option>)}</select></Field>
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
              <img src="data:image/png;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDAAUDBAQEAwUEBAQFBQUGBwwIBwcHBw8LCwkMEQ8SEhEPERETFhwXExQaFRERGCEYGh0dHx8fExciJCIeJBweHx7/2wBDAQUFBQcGBw4ICA4eFBEUHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh7/wAARCAImAtUDASIAAhEBAxEB/8QAHAABAAIDAQEBAAAAAAAAAAAAAAYHAwQFAgEI/8QATBAAAgIBAgIFBQwIBgAGAQUAAAECAwQFEQYhEjFBUWETInGx0QcUMlJTYnOBkZKhwRUWIzM0NUJyQ1STsuHwJFVjgqLxwhclRIOj/8QAHAEBAAIDAQEBAAAAAAAAAAAAAAUHAwQGCAIB/8QAPxEBAAECAwUFBQUGBQUBAAAAAAECAwQFEQYhMUFREhNhcbEHIoGRwRQyQlKhFSMzYtHicoKy4fA0kqLC8TX/2gAMAwEAAhEDEQA/APxkAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABnx8PLyf4fFvu/srcvUfkzEcX3RbquT2aI1nwYAdijhjXrlvDTL9vnLo+s2ocF8QSW7xIx9M0YpxFqONUfNJ28hzO7GtGHrn/ACz/AER0EinwXxBFcsSMvRNGrfwxr9K3npl+3zV0vUIxFqeFUfMuZDmdqNa8PXH+Wf6OODYyMLMxueRiX0/31uPrNcyxMTwRlduu3PZrjSfEAB+vgAAAAAAAAAAAAAADexdJ1DJSlViz6L7ZLZfiBog6d2g6pXHpe9nJfNe5zrITrm4WQlCS61JbMDyAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAH1Jt7JbskvDvBmp6p0br08PGfPpTXnSXgvaWHofDOk6RFSox1Zcuu2zzpfV3fUaOIzC1a3Rvl22RbB5lmsRcrju7c86uM+UcZ+OkeKtdH4R1vUlGcMbyFT/xLn0V9nW/sJZpnueYNW0tQy7ciXbCtdCPtf4E3BE3cyvV8J0jwWnlns8yfBRE3aZu1dauHyjd89XLwOHtFwkve+m46a6pSj0pfa92dOMYxW0YpehH0GlVXVVOtU6uyw+EsYans2aIpjpERHoAA+WwAAD5KMZLaSTXijm52gaNm7++dOx5SfXJR6MvtXM6YPqmuqmdaZ0YMRhbGJp7N6iKo6TET6oTqfueafbvLAy7saXZGfnx9vrInq/B+t6cnN43vmpf10Ppfh1r7C4gbtrMb1HGdY8XG5n7PcnxsTNumbVXWnh8p3fLR+fmmns0012M+Fle6XPQacdwuxoT1Kxbwdb6Mo/Olt1/WVsk29kt2ydw9/vqO3popHaDJYyfGThe9i5p05eExynw1l8ABnQYAAAAAHquE7LI11xcpSeyS7WeSRcE4kbcuzLmk1Sto7977fsA3sHTsDRMRZmoOM7/AB57Puiu/wATSzOKsiUmsSiFcOxz5v2Gtn5z1DiKnd70wujCEX1bdJb/AGkg1vLwdL8l08Cuzym+20YrbYDhU8UajCW9kabF2px29R1qMvS+IKvIX1eTv25J/CX9r7T7peZpOrynj+8IQmo77OC5r0ojer4z0zV510TaUGpVvfml1oDxrGnW6blumzzovnCfxkaRMdR6OscMLKSXlal0vQ18IhwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOtw1oWZrmZ5LHXQqi/2trXKC/N+B81100U9qqdzYwmEvYy9TYsUzVVVwiGnpen5ep5ccXCplbZLu6ku9vsRZ3C3BuFpSjkZijl5i57teZB+C/N/gdrQtIwtGw1j4daXx5v4U33tnQOfxeYVXfdo3R6r52X2Cw2WRTiMXEV3f8Axp8us+M/DqAHyTUYuUmkkt232EcsLg+gi2vcb6Vp7lVjN5t65bVvzE/GXsIPrHGGt6i5RWR71qf9FPm/j1m7Zy+9d36aR4uLzjbzKctmaIq7yuOVO/5zw9Z8Fq5+qadgLfMzaKPCc0m/Qus4OZx7oNDaqlkZL/8ATr2X/wAtiqJylOTlOTlJ82292z4SVvKrcfemZV9jvajmF2ZjDW6aI8dap+kfosO/3SIc1RpUn3Od234JGpP3Rs5vzdOxkvGUmQcGxGX4ePw+rn7m3efXJ1nEaeVNMfROI+6Nnb+dp2M/RKSNqj3SI77X6U14wu3/AAaK9AnAYefw+pb27z63OsYjXzimfotfD490K9pXPIxn/wCpXuv/AI7newNV03PW+Hm0XPujNbr6usoo+xlKMlKLcWuaafNGvcyq3P3ZmE/gvajmNqYjE26a48NaZ+sfo/QJHeMuJqNDxvJVdGzNsXmQ7I/OZXul8Xa5p8ehHLd8NtlG5dPb6+s4+VkX5mVPIyLJW3WS3lJ822YbOVzFetydYSuce02i7guxgKJpu1bpmdPd8Y6z06GVkZGZlTvyLJW3WS3lJ822WJwHwisVQ1PU608h86qpL934vx9Q4C4SWKoapqde+Q+dNUl+78X4+onB847Ha/urXBs7FbFzTMZlmUa1zvppnl/NV49I5cZ38IxxTwfg6spX4yji5nX04rzZv5y/P1lYatpuZpeXLFzaZVzXU+yS70+1F7GjrWlYer4bxcypSj1xkvhQfemYcJmFdr3a98JjajYPC5pFV/CxFF7/AMavOOU+MfHVRYOxxRw/l6Fl9C5eUom/2VyXKXg+5+BxzoKK6a6YqpncoXGYO/gr1Vi/TNNVPGJAAfTWCXcI8tCynH4XSl/t5ERJJwRlRjfdhzf7xdKO/eutAcTTP5ni/TQ/3ImmvY+m5DpWoX+S236Hn9HfvIzk4U8HiSmpp9CV8ZVvvTkjp8efBxPTL8gN+GLp2hY882mm2zdbOUfOe35Ih+pZc87NsybFs5vkl2LsRJODc5X49mnXtS6K3gn2x7UcLW9Ong6lLHhGUoTe9Xin2ensA7vCe70DLU/gby/28yJPrJjlJaPwt5CTSusj0WvnS6/sRDgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAG3o+n5GqahVhYsd7LH19kV2t+B+VTFMayyWbNd65TbtxrVM6REc5lt8L6Hk65qCoq3hTHnbbtyivaXFpWn4umYUMTDrVdcF9bfe+9mLQdKxtH06vDxo8lznPtnLtbN85rGYub9Wkfdh6N2Q2UtZHh+3cjW9V96en8seHXrPwACL8Z8V06NCWLi9G7OkurrjX4v2GtatVXauzTG90eZZnhssw9WIxNXZpj9fCOsupxBr2n6Jj+Uy7N7JLzKo85T9i8Sr+JOKdS1mThKfkMbflTW+T9L7Tj5uVkZuTPJyrp3Wze8pSfMwnQ4XAUWd875UFtLtvjc4qm1anu7PSOM/4p+nDz4gBv6Ro+o6rb0MHFnYt+c+qK9LN2qqKY1mdHHWMPdxFyLdmmaqp4REay0AWHpPudxSU9UzG3210r837CT6fwzoeEl5HTqZSX9Vi6b/Ej7uZ2aN1O93eXezbNsVEVXtLceM6z8o+swpmmi+6XRqpssfdGLZuQ0TWZreGlZ0l4US9heEIQhFRhGMYrqSWyPRqzm9XKl1Fn2U2Yj97iZmfCmI+sqNnomswW8tJzorxx5ew1Lse+l7XUWVvulFov08zjGcXGcVKL601uj8jN6udJd9lNiY/d4mYnxpifrD8/gsr3QZcO4GM6padjWZ9i8yMF0HH50tv+srZJtpJbtkrh7/fUdrTRWWf5L+x8V9mm7TXMcdNd3hPj4ayJNtJLdssjgPhFYyhqeqV73vnTTJfA8X4+ocBcJLFUNU1Ove986apL4Hi/H1E5IvH4/XW3bnzlZmxGw/ddnMMwp97jTTPLxnx6Ry4zv4ADFl5FGJjTyMiyNdVa3lKT5JEPEa7oWzXXTRTNVU6RDKCOcO8XafrGbZiRUqLOk/JKb/eR8PHwJGfdy1Xbns1xpLUwGY4XMbXfYWuKqeGsdYa2pYONqOFZiZdSsqmtmn2eK7mU/wAV6Bk6FneSnvZjz5027fCXc/Euk0ta0zG1bT7MPKjvGS5SXXF9jRs4PFzYq0n7sud2t2VtZ5h+1RGl6n7s9f5Z8J/SfjrRQN3W9NyNJ1K3CyV50H5suyUexo0jpqaoqjWODzhfsXLFyq1djSqmdJjpMB7otsouhdVJxnB7xaPAP1iTPGytP4gxI0ZO1eTHmkns0++LOVncN6lCX7GccmHZ52z+xnCTaaabTXU0dLF17U8eKish2RXUrF0vx6wMmPw/q8pr9iqvnSmlt9nM7mHp2Fo1fvzUMhWWxXmuXUv7V2s4lvEmqTjsrK4eMYc/xOZkX3ZFnlL7Z2S75PcDb1zU7NTyum041R5Vw7l3vxOeAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAtzgDQFpGmLIyIbZmQk57rnCPZH2/wDBUtU51WwtrfRnCSlF9zRbXBXFFWtULHyHGvOgvOj1KxfGX5ojcz7zuvd4c1jezWcvjMpnET+909zXhrz/AM2nDw1SYAHPL9RrjziGWiYUaseLeVemoScfNgu1+nwKktsnbZK22cpzk95Sk922XnrOmYmrYM8TLr6UJfBa64vvRT3EmiZeh5zx8hdKuXOq1LlNe3wJzK7lrs9iPveqk/aZl+ZTfpxVc9qxG6NPwz4+fX4dHLPdFNt90KaK5WWTe0YxW7bM2m4WTqOZXiYlTstm9kl2eL7kW3wnw1iaHjqW0bsyS/aXNdXhHuXrNzFYujDxv3z0clsxspis+u+77tuONX0jrPpz5ax/hjgOEVDJ1p9KXWseL5L+59voROsemnHpjTRVCquK2UYrZIyA529iLl6da5egcnyHA5Pa7vC0adZ41T5z9OHgAGvm5uJhV+Uy8mqiPfOSRiiJmdISty5RbpmqudIjnLYBGM3jnQcduNd1uRJfJw5P62c2z3RsFfu9OyX/AHSijYpwd+rhTLnr+1+SWJ7NeJp18N/pqnJHeMuJqNDxvJVONmbYvMh2R+dL/vM4WV7o1csWxY2n2Rva2g5yTin3sgWVkX5mVPIyLJW3WS3lJ822buFy6qatbsaRH6uQ2n9oeHt4fusrr7VdX4tJ0pj4xvnp04mVkX5mVPIyLJW3WS3lJ822WHwFwksZQ1TVK973zppkvgeL8fUOAuEliqGqanXve+dNUl8Dxfj6icn7jsdr+6tcGHYrYqqmqMyzKNa5300z/qq8ekcuM7+AAxZeRRiY1mTkWRrqrW8pSfJIiIjXdC1666aKZqqnSIMvIoxMaeRk2RrqrW8pSfJIqTjPia7XMnyVXSrwa35kO2T+NI2df1jUOLdWhp+n1z979L9nX1b/AD5f95Ef1XT8rTM2eHmVuFkH9TXeu9E9gcJTanWv73Too7bXavEZnaqtYOJjDRPZmvSdKp46a9PDnxlrVzlXOM4ScZRe6aezTLU4D4oWrUrBzZJZta5P5Vd/p7yqTJjX242RXkUWSrtrkpRkutM3MVhqcRRpPHk5HZraPEZFiou0b6J+9T1j+scp+i/gcbhHXKtc0uN/KORX5t0F2S7/AEM7Jy9dFVFU01cYemMFjLONsUYixOtNUaxP/P1RzjvQY6zpbspivfmOnKp/GXbH6/WVC002mmmutM/QJVnumaL7w1RahRDbHynvLbqjZ2/b1/aS2WYnSe6q+Cq/aVs5FVEZpYjfGkV+XCKvhwn4dEQABNqZAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD1CMpzjCCblJ7JLtZ5JN7nGm+/8AiKFs471Yq8rLfv7Px9Rju3It0TXPJv5XgK8wxlvC2+NcxH9Z+Eb3Y1fgSUdBx7cFOWdVXvdDf94+t7eKINRbfiZMbapzpuqlumuTi0X6QzjvhOOoRnqWnQUctLeytdVvivnesiMHmGs9i7wnmtjazYKmi1GLyqnSqiI1pjnpzj+br148eO9wXxRTrVCx8hxrzoLzo9SsXxl7CSlBU234mTG2qc6bqpbprk4tFr8FcUVa1QsfIca86C86PUrF8ZfmjHjsD3f7y3w9EjsVtrGYRGCx06XY4T+b+7180mNLWtMxNWwZ4mXDpQl8GS64vvRugjKappnWOKxr9i3ft1WrtOtM7pieEwqRx1TgjX+n0VZVPlvt5t0N+rwZZui6piavgQzMOfSg+Uovrg+5+J91nTMTVsGeJl19KEuprri+9FZNatwRru63son9y6H5NfgSfu46npXH6q20xGxeI514KufObcz9PXz420a2pZ+Jp2LLJzb4U1R7ZPrfcl2s42VxfpNWhR1Ouzykp8oUb+f0u5923eVfrmr5usZjycy1y+JBfBgu5IxYbAV3Z97dEJPaTbrB5XZiMNMXLlUaxpO6InhMz9OM+CTcQ8fZeQ5U6TD3tV1eVkt5v8kQ7JyL8m125F1ls3zcpybZiBPWrFuzGlEKNzXPMfmtzt4q5NXhyjyjgAH1JtpJbtmZEiTbSS3bLI4C4SWMoapqde9786mmS+B4vx9Q4C4SWKoanqde97500yXwPF+PqJyQmPx+utu3PnK6NiNh+67OYZhT73GmmeXjPj0jlxnfwAGLLyKMTGnk5Nka6q1vKUnySIeI13Qtmuumimaqp0iDLyKMTGnkZFka6q1vKUnySKt4g1jUOLdVhp2nVz97dL9nX1dL58v+8jW4y4mv1zJ8lU5V4Nb8yHbJ/GfsJj7mMdI/RMpYXPM//kufwvDb5pL0WPsdvvqo1q9FU4zOY2tzH9lYa72LEb6p516cqfD/AOzw0dXhTh/G0LC6ENrMma/a27c34LuR84u0CjXcBwfRhk1remzbqfc/BnbBG9/X3nea71izk2C+w/YO7jutNNP+c+evHXeoLLx7sTJsxsit121ycZRfYzEWX7p2grJxP0xjQ/bUra5JfCh3+ler0FaHTYbERftxVDzbtJkV3JMdVhq99PGmesf15T4uxwlrNmi6xXk7t0y8y6PfF/musuiqcLao21yUoTSlGS6mn1M/P5aHuXau8vTJ6bdLe3F5w37YP2P1mhmmH1p72OXF3Pszz+bV6csuz7tW+nwnnHxjf5x4pkc3iXTIato1+FJLpSjvW+6S6jpAhaapoqiqOMLlxOHt4qzVZuxrTVExPlL8/wBkJV2SrmmpRbTXczySj3StN948QyvhHarKj5Rf3dUvb9ZFzrbNyLlEVxzeU81y+vLsZcwtfGiZjzjlPxjeAAyI8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAC0/crwfe+gzzJLaeTY2n82PJfjuValu0l2l66LirB0jExEtnVVGL9O3P8AHci81udm1FPVZnswwEXsxuYmqN1und51bvSJbgBzOKM39H6BmZSaUo1tQ/ufJesgqKZqqimOa8MViKMNZrvV8KYmZ8ojVU/GGXVm8R5l9EIxr6fRXRW3S25b/WczGvtxr4X0WSrtg+lGUXs0zw229292fDrqKIppil5NxWLuYjE14md1VUzVu5TM67lu8F8T061QsfIca86C86PUrF8ZewkpQONfbjXwvoslXbB9KMovZplscFcUVa1QsfIca86C86PUrF8Zewg8dge79+jh6Lu2K22jMYjBY2dLscJ/N/d6+aTGlrWmYmrYM8TLh0oS+DJdcX3o3QRlNU0zrHFY1+xbv26rV2nWmd0xPCYUjxJomXomc8fIXSrlzqtS5TXt8Dll66zpmJq2DPEy6+lCXwZLri+9FPcSaJl6HnPHyF0q5c6rUuU17fA6PBY2L8dmr73q8+bY7HXMluTfsRrYn50z0nw6T8J38eWAfUm2klu2b7hBJtpJbtlkcBcJLGUNU1Ove986aZL4Hi/H1DgPhJYyhqeqV73vnTTJfA8X4+onJCY/H6627c+cro2I2I7rs5hmFPvcaaZ5eM+PSOXGd/AAYsvIoxMaeRk2RrqrW8pSfJIh4jXdC2a66aKZqqnSIMvIoxMaeRkWRrqrW8pSfJIqTjPia7XMnyVTlXg1vzIdsn8aXsHGXE1+uZPkqnKvCrfmQ7ZP4z9hHToMDge69+vj6KG2121qzOqcHg50sxxn839vrxkN3RdSydJ1CvMxZbTg+cX1SXan4GkCSqpiqNJV5YvXLFym7anSqmdYmOUr10XUcfVdNqzsZ+ZYuafXF9qfoN0qv3M9ZeDq36Pun/4fLey3/pn2P6+r7C1DlsXh+4uTTy5PTWyufU53l9N+fvxuqjxjn5Tx/Tk8zhGcJQnFSjJbNPtRSvFmlPSNcvxEn5Lfp1Pvi+r2F2EK91fTldpdOowj5+PLoy/tf/PrM+W3u7u9meEob2h5PGPyub9Me/a3/D8UfX4KyOvwfqL0viDGyG9q5S8nZ/a+X/JyAdDXRFdM0zzUFg8VcwmIov2/vUzEx8H6BT3W6PpyeEc56hw7h5MnvN19Gb+dHk/UdY5CumaKppnk9ZYTE0YqxRfo4VREx8Y1RP3UcH3zw8sqK3ni2KW/zXyf5fYVSXxquLHN0zJxJdV1UofaiiJJxk4yWzT2aJ3KrnatzR0+qkvahgIs5hbxVMfxKdJ86f8AaY+T4ACUViAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAN/h3H99a9g47W6nkQUvRvz/AvMp73O6vKcX4e63UOnJ/cf5lwkDm1WtymPBensssRTl969zqr0+UR/WQhvusZTq0OjGi+d1y3Xglv69iZFb+69d0s/Bo3+BXKT+tr2GtgKe1iKXQ7dYmcPkV+Y41aU/OYif01QU+pNvZdbPhuaJR751jDx/lLox/E6aqdImXm+zam9cpt08ZmI+aaa3wSp6Di5OnQ2zKqI+Vr+V5bv/3esglFt+JkxtqnOm6qW6a5OLRfpDOO+Eo6hGepabBRy0t7K11W+K+d6yFweYb+xd4TzXHtbsJEW4xmWRpXREa0xz050/zdY58Y38d7grierWsdY+Q4150F50epWL4y9hJSgqLb8TJjbVOdN1Ut01ycWi1+CuKKtaoWPkONedBedHqVi+MvzRix2B7v95b4eiQ2K21jMIjA42dLscJ/N/d6+aTGlrWmYmrYM8TLr6UJfBkuuL70boI2mqaZ1jisa/Yt37dVq7TrTO6YnhMKR4k0TL0TOePkLpVy51Wpcpr2+B3vcvxdKv1KdmXNSzK+dFUl5rXbJd7Xd9fosPWdMxNWwZ4mXX0oS+DJdcX3oqHXtJz+HdUjGUpR2l0qL4cult2ruZO2cT9rtTbmdKlIZvs9OyuZW8xt2+9w8Twn8PhPl+GZ58d/G6wRbgjimvWKViZbjXnwXoVq71496JJl5FGJjWZORZGuqtbylJ8kiFuWa7dfYqjeuPL82wmYYWMXYr1onn06xPSY5mXkUYmNPIyLI11VreUpPkkVJxnxNfrmT5KrpV4Vb8yHbN/GfsHGXE1+uZPkaulXhQfmQ7Zv4z9hI+AuEfJeT1XVa/P+FRRJfB7pS8e5ErZs0YOjvbv3uUKvzjOMXtbi/wBl5Xusx96rlMdZ8OkcapcOjgnVLdBeobdG9+dDGa85w9vgReScZOMk009mn2H6BIXx3wks+M9S02tLLS3sqX+L4r53rP3C5lNVfZu8+DHtL7OqcPhKb2W61VUR70Tvmrxjx8OnDfxrEH2ScZOMk009mn2HwmVQvVc5VzjODalF7prsZePD+ctS0bFzV12Vpy/u6n+JRhaHuT5Lt0O/Gb/c3cvRJb+0jM0t9q1FXRZXsxzCqzmVeFmd1yn9ad8fpqmRpa7iLO0fLxGt/KVSSXjty/HY3QQFNU0zEwvS/Zpv2qrVfCqJifKdz8/STjJp9aex8N/iGhY2u52PFbKF80vRuaB2FNXaiJeR8RZmxdqtVcaZmPlOizPckyvKaTlYje7puUl4KS9qZNitPciu6OrZlHx6FP7stv8A8iyzm8wp7OIqejdgsTOIyKzrxp1p+Uzp+mgUfxRj+9eIs+nbZK+TS8G91+DLwKg90iryfFuTL5SMJ/8AxS/Iz5TVpdmPBBe1LDxXltq7zpr0+ExP9IRwAE+okAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAASr3LY78Up/Fom/UWwVP7lr24pS76Jr1FsHO5p/H+D0D7M9P2NP+Or0gKs91iTfElS7FjR/3SLTKr91dbcS1vvxY/7pH5ln8f4MntJ1/Yk/4qfqiJ2eCYdPirT13XJ/YcY7XBElHivT2+23b8Cev/wqvKVG5Lp+0cPr+en/AFQugAHIvWCsvdXwsXH1HGyKalC2+Mna11S225+kh2NdbjXwvoslXbB9KMovZpk691+D8tp9nZ0Zx9RATp8DPaw9OrzTttRFjPr/AHcdnfE7t2/sxOvnrv8ANbvBXE9WtY6x8hxrzoLzo9SsXxl7CSlA4192NfC+iyVdsHvGUXs0y2OCuKKtaoWPkONedBedHqVi+MvzRGY7A9379HD0WXsVttGYxTgsbOl2OE/m/u9fNJjS1rTMTVsGeJl19KEvgyXXF96N0EZTVNM6xxWNfsW79uq1dp1pndMTwmFKa9pOfw7qkYylKO0ulRfDl0tu1eJ74g4k1LWqKaMqcY11xW8YclOXxmW3rWmYmrYM8TLr6UJc4yXXF96Kb4i0q3RtUswrZws6POMovri+r0M6DB4mjE6duPehQu1mz2M2epr+y1z9muzvjXhPGInr4Tz4T4uG83G07WKMvLxlkVQfOL7PFeKLrwsrHzcWvKxbY21WLeMkUdpum52oytWFjzudUHOfR7F/3sOrwhxHkaDl9CfSsw5y/a1dq+cvH1jHYXv99E+9HJ+7E7TzkkxZxVGli5O6rThMbtdecdenLpNxAw4WVj5uLXlYtsbabFvGSMxz0xMTpK/KK6blMV0TrE8JQvjzhJZynqWm1pZS521r/F8V871lZSTjJxkmmns0+w/QJC+O+ElnxnqWmVpZaW9lS/xfFfO9ZL4HH9nS3cndylVO2+xH2jtY/AU+/wAaqY5+MePWOfLfxrEnvuQTfvnUK9+XQhL8WQOScZOMk009mn2E39yKyuOpZsJWRU51R6MW+ctm99iQx8a4epwGw9XYz7D67t8/6ZWUADmHpdTXHsFDi3PS7Zp/bFM4R3uP5KXFuc12SivsijgnW4f+FT5Q8pZ9ERmmJ04duv8A1SlnuVy6PFDXxsea/FP8i1iqPcsi3xTv3UTfqLXIPNP4/wAF2ezTX9i7/wA9X0CqvdVSXE8X340H+Mi1SqvdWe/E0PDGh65DK/4/wfvtK/8Axf8ANT9USAB0Tz4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAJH7nFnk+LsRN/DU4/wDxb/It8pDha9Y3Een3N7JXxT9Dez9Zd5AZtTpdifBe3stvxVlt21zpr1+cR/SQrT3XaujqmFd8elx+x/8AJZZCPdcxunpeJlKO7qtcW+5Ne1IwZfV2cRSndvcPN/Ir2nGnSflMa/pqrQ3+Hr1ja7g3vqhfBv7TQPsZOMlJdae6OlqjtRMPOWHvTYvU3Y40zE/KdX6BBqaNlRzdKxcqL38rVGTfjtz/ABNs46qJpnSXrmzdpvW6blPCYiY+KF+61jOzRcbJX+Dds/8A3L/grEvDibA/SWhZeGlvOdbcP7lzXqKQaabTWzXWT+V3O1amnooj2m4CbOaU4jTdcpj507p/TR8MmNdbjXwvoslXbB9KMovZpmMEnMaq4pqmmYqpnSYW5wVxRTrVCx8hxrz4Lzo9SsXxl7CTFA491uPfC+iyVdkH0oyi9mmTv/8AUGX6B28h/wDufwN9vM/v/wCCDxWW1RXrajdP6f7Ls2Y9odirCzbzOrSuiN1X5ojl/i9Xd424oq0Wh42M42Z815setVr4z/JFcaNpmocRas4QlKc5vp3XT5qK737D7o2mahxHq0owlKc5y6V10+aiu9+wt3QtJxNHwI4mJDZLnOb+FOXezJXXRgKOzTvrloYXC43bjG/acTrRhaJ3R18I6zP4p5cIND0rE0fAjiYkNkuc5v4U33sivHnCSyVPVNLr2vXnXUxXw/FePrJyCLtYi5bud5E71lZls/gcfgfsNdERREe7p+HpMf8AN/NTvCHEeRoOX0J9KzDnL9rV3eK8S3MHKx83FrysW2NlVi3jJFce6jg6XjZ1d+NYoZl3O2mK5NfGfc/Wcng/iTI0LK6Mulbh2P8AaV93zo+PrJW/hoxduL1uNJ9VY5JtBd2Wx9WU4+uK7UTuqjf2dfp1p4xPDxuMGHCysfNxa8rFtjbTYt4yRmIOYmJ0lc9FdNymK6J1ieEoXx5wms+M9T02tLLS3trX+L4r53rK2otvxMmN1M503VS3jJcnFov0hfHfCSz4z1LTK0stLeypf4vivneslsDjtP3d3gqvbXYqbszmOXRpXG+qmOf81P8AN1jnxjfx6HBfE9Ot46ovca8+tefHqU18aP5okhQWPdfiZMbqZzquqlvGS5OLRaHDvGFGfo+RPJcKs7GplOUepWbLrXsPnG4CaJ7dvhP6NnY7bmjGW/suYVaXaY3TP4oj/wBvVXnFFyyOItQtT3jLIns/Dfkc09WSc7JTfXJts8k7RT2aYjopDFX5xF+u7P4pmfnOqae5JU5a3lXdkMfo/bJews4gvuQ43RwM7La/eWRrX/tW/wD+ROjm8xq7WInweidgMNNjIrOvGrtT85nT9IgKj90y1WcWXR3/AHdcI/hv+ZbhSfGGR754n1C1dXlnH7vm/kZ8qp1uzPgh/ajfijK7dvnVXHyiJ/rDkgAn1DgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD7CThOM4vZxe6ZfOnZCy9Px8qO211UZ/atyhS2fcyzllcNQoct5403W14PmvW/sIrNbetuK+i0PZdj4tY67hZn79OsedP+0z8kpOPxnhPP4azKIreah04rxjz/I7B8klKLi1umtmiDormiqKo5LqxuFpxeHuYevhXEx840fn4HT4n096ZruVibNRjPeHjF80cw6+iqKqYqjm8mYrD14a9XZuRpVTMxPnG5aPuV6gsjRLMGct7MafJfNfNfjuTEpngnVv0Rr1Ns5bUW/s7e5J9v1P8y5U01uuo53MbPd3pnlO96D9n+bxj8pptVT79r3Z8vwz8t3wfSo/dE0h6Zrs7647Y+U3ZDbqUv6l9vP6y3DmcTaRTrWk2Ydm0Z/Cqnt8CS6mY8FiO4uazwni39sMg/bWXVW6P4lPvU+fT4xu89JUgDPnYt+Fl2YuTW4W1y6MkzAdPExMaw80V0VW6porjSY3TAdLh7RsvWs+OLix2S52WNebCPe/YOHtGy9az44uLHZLnZY15sF3v2Fw6FpOJo+BHExIbJc5zfwpy72aONxsWI7NP3nbbH7H3c6u99e1psU8Z/N4R9Z5eZoelYmj4EcTEhslznN/Cm+9m+Ac5VVNU6zxehrFi3h7dNq1TFNNMaREcgjnGfE1Oh43kaejZnWLzIdkF8aXs7RxnxNRoeP5GlxtzrF5kOyC+NL2dpUuXkXZeTPIyLJWW2PeUpPm2SWBwPe+/Xw9Vd7a7a05bTODwU63p4z+X+70MrIuysizIyLJW22PpSlJ82zEAdBEaboUPVVVXVNVU6zLv8H8SZGhZXRl0rMOx/tK+75y8fWW5g5WPm4teVi2xsqsW8ZIoQ7/B/EmRoWV0ZdK3Dsf7Svfq+dHx9ZG47Axdjt0fe9VibF7aVZXVGDxk62Z4T+T+3rHLjC4wYcLKx83FrysW2NtVi3jJGY56YmJ0lfdFdNymK6J1ieEoXx5wms+M9T02tLLS3trX+L4r53rKyalGTi04tcmn2H6BIXx3wks+M9S0ytLKS3sqX+L4r53rJfA47s6W7nDlKqdt9iPtHazDL6ff41Uxz8Y8esc/PjWIPsk4ycZJpp7NPsN/h3AlqetYuElynNdP+1c3+BNVVRTE1SprD4evEXqbNuNaqpiI853LX4Gwng8MYdcltOcfKS9MufsO2fIRUIqMVsktkj6cjcrmuqap5vWeAwlODw1vD0cKIiPlGjDm3wxcO7Js+BVXKcvQluULbOVts7ZveU5OTfiy2vdJzvefDFtcXtPJkql6Ot/gtvrKjJrKbelE19VMe1LHxcxtnCxP3KZmfOr/AGiPmAAllWgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAS73LtS96a5LDnLavKj0Vz/qXNfmiImTGusx8iu+qXRsrkpRfc0Yr1qLtuaJ5pPJsxqyzHWsXT+GdfOOcfGNYX8DS0TPr1PSsfOqa2thu13PtX2m6clVTNMzEvVdi9Rft03bc601RExPhKDe6tpLuxKtWqjvKnzLdvit8n9T9ZWxfuXRVlY1mNfBTqti4zi+1MpLiHS7tH1a7Bt3ai965fHi+pk7leI7VHdzxj0Uj7SsinD4qMxtR7tzdV4VR/WP1iernlq+5vrq1HTFgZE98rFikt3znDsf1dX2FVG1pWdkabn1ZuLPo2VvddzXan4M3MXh4v2+zz5OT2Wz+vI8fTf40TuqjrH9Y4x8ua+Ac7h7V8XWtOhl40ufVZDthLuZl1jUsTSsGeZmWdCEepdsn2JeJzE26oq7Gm96Uox+Grw32qK47vTXtctOqO+6TpWm5Gly1C+2GNk1LaE9v3nzGu38iveHtGy9az44uNHaK52WNebBd79h1bbNW4211QgnCmHUv6KYd7736yzNC0nE0fAjiYkNkuc5v4U5d7Jeb9WCs93M61eip6cms7YZtVjbdvsYendNXCbkx6eM8dPHg0PSsTR8COJiQ2S5zm/hTfezfAIaqqap1nit6xYtYe1TatUxTTTuiI5BHOM+JqdDxvI09GzOsXmQ7IL40vZ2jjPianQ8fyNLjZnWLzIdkF8aXs7SpcvIuy8mzIyLJWW2PeUpPm2SWBwPe+/Xw9Vd7a7a05bTODwc63p4z+X+70MrIuysizIyLJW22PpSlJ82zEAdBEaboUPVVVXVNVU6zIAd3h/hXVdYlGcKXRjPrutWy28F1s+K7lNuNap0hs4LAYnHXYs4aiaqp5R/zd5y4+Lj35WRDHxqpW2ze0YxW7ZYmn8A4/wCg51Zln/j7EpKyL5VPu8fEkPDnDun6HTtjw6d8l590/hP2LwOwQeKzKqudLW6F17M+zzD4S1NzMoiuuqNNOVMT6z48uXVU+i6pqXB+sTwc6uTx3L9pX2NfHj/3mWjg5WPm4teVi2xsqsW8ZI53FGg4uu4PkrdoXw51Wpc4v814Ff6JqmpcH6xPBzq5vHcv2lfY18eP/eYqppxtPap3VxxjqYfEYjY7ExhsTM14Oufdq4zRPSfD/wCxzhbAMOFlY+bi15WLbG2mxbxkjMRcxMTpKy6K6blMV0TrE8JQvjzhJZ8Z6nptaWWlvbWv8XxXzvWVtRdfiZMbqZzpuqlvGS5OLRfpC+O+ElnRnqWmVpZSW9lS/wAXxXzvWS2Bx2n7q5wVXtrsVN2ZzHLo0rjfVTHP+an+brHPjG/jv8FcT063jqi9xrz6150OpTXxo/miSlBY91+JkxupnOq6qW8ZLk4tFnaFxpi5Wi33ZjjXmY1blKHUre5x+vsPnG4CaJ7VuN0/o2Nj9ureLtfZsxq7NymPvTwqiOv80fr5o77qmorJ1qvBhLeGLDzv75c3+GxDjNmZFmVl25N0ulZbNzk/Fswk1YtRatxR0U9neZVZnj7uLq/FO7y4RHwjQABlRYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACce5brPvfMnpF89q730qW31T7V9a9XiWUfn+qydVsba5OE4NSjJdaa6mXPwhrVet6TC/dLIr2hfFdku/wBD6yCzPDdmrvaeE8V3ezbaGL1mcsvT71O+nxp5x8PTydkjvHWgLWtN6dMV78oTdT+Mu2P1+skQIy3cqt1RVTxhZGY4CxmOGrw1+Naao0n+seMcYfn+cZQnKE4uMovZprmmeSyPdD4WeQp6tp1e9yW99UV8NfGXj3lbnU4fEU36O1S8yZ/kWIyTFzh70bvwzyqjr/WOUulw7rOXomfHKxpbxfKytvlOPc/adWyzVuN9dUYrydMOpf0Ux733v1nK4f0fL1rPji4sdkudljXmwXe/YXDoWk4mj4EcTEhslznN/CnLvZp43EW7FXapj33WbHZHmGdWO5vVzThInWY/NPSPDry+JoelYmj4EcTEhslznN/Cm+9m+AQFVU1TrPFe9ixbw9um1apimmmNIiOQRzjPianQ8byNPRtzrF5kOyC+NL2do4z4mp0PH8jU42Z1i8yHZBfGl7O0qbKvvzMqd99krbrJbyk+bbJLA4Hvffr4equ9tdtactpnBYKdb08Z/L/d6PmTffl5U777J23Wy3lJ83Jknw+AtZyMSu+U6KZTW/k5t9KPp5Hf4D4RWGoanqdaeS+dVUl+78X4+om5nxWY9irsWeSE2Z9ntOKszis111r3xTrpPnVPWenz38Kwr9zvVpPzsvEh9cn+R0ML3OYJp5mpSffGqvbf637Cfg06sxxE83X2PZ9kVqdZtTV51T9JhxNK4V0PTmp1YcbbF1WXee/x5L7DtgGnXcqrnWqdXV4TA4bBUd3h7cUR0iIgAI1xPxfp+kRlTRKOVmLl5OL82L+c/wAus/bdqu7V2aI1ljzDMsLl1mb+KrimmOvpEcZnwh1tb1XD0fCllZlnRXVCK+FN9yRUHEutZOuag8m/aMI+bVWuqETBrGp5urZbyc252T6orsiu5LsNI6HB4KmxHanfUoLa3bK9ndXc2o7NmOXOrxn6Ryd/g/iTI0LK6Mulbh2P9pX3fOj4+stzBy8fNxa8rFtjbVYt4yRQhaHuY6VqGFg2ZWVZOum9J147/wBz7tzXzPD2+z3muk+roPZvnuOm/wDs+aZrtcdfyf7T068OaZAAg11oXx5wks+M9S02tLLS3tqX+L4r53r9JWUk4ycZJpp7NPsLq4r1mrRNJsyZbO6Xm0wf9UvYutlL322XXTutk5WWScpSfa3zbOgyyu5VbntcI4KD9pOCy/DY+mrD7rlUa1xHDwnwmd+vz57/AAACTVwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAdXhjWb9E1OGVXvKt+bbXv8KPtOUD5roiumaauEtjC4q7hL1N+zVpVTOsSvvAy6M7Dry8axTqsjvFozlRcEcS2aJleQyHKeDa/Pj1uD+MvzRbVFtV9MLqbI2VzXSjKL3TRzGLwtWHr05cnpTZfaWxnuF7cbrlP3qek9Y8J5fJ7IVxVwPXn5scvTZ148rJry0GvN8ZLx8CagxWb9dmrtUSk82ybB5vY7jF0dqOMdY8paGh6ViaPgRxMSGyXOc38Kb72b4BjqqmqdZ4t+xYtYe1TatUxTTTuiI5BHONOJqdDxvI09G3OsXmQ7IL40vZ2jjPianQ8fyNTjZnWLzIdkF8aXs7SpcvIuysmzIyLJWW2PpSlJ82ySwOB7336+HqrvbXbWnLaZwWCnW9PGfy/3ehlZF2VkWZGRZK22x9KUpPm2WF7nfDOPVXXq2ZKu69rpU1ppqvxfzvV6equDLRkX0S6VF1lT74Sa9RMYizVct9iidFR5Dm2Hy7Gxi8Va72Y3xrOmk9eE6z5+fFfoKXxuKdfo2UNSukl2T2l6zdjx1xCls8il+mlEPOVXY4TC3LXtQyqqPft1xPlE/VbYKklx1xC1ssileilGlk8Va/fv0tSuin2Q2j6hGVXp4zBd9qGVUx7luuZ8oj/2XJffRjwc77q6ortnJIjmrcb6LhJxpslmWLqVS5fefIqnIyMjIl0r77LX3zk36zEbVvKqI31zq5jMfali7sTThLUUeM+9P0j1STXuMtX1RSqhNYeO/wCip82vGXW/wI2ASVu1RbjSiNFc4/MsXmF3vcVcmurx+kcI+AfUm2kk23ySRt6TpmdqmSsfBx5Wz7WuqK72+ws7hPhDE0jo5OV0cnN61Jrza/7V+ZhxOLt2I38eia2e2Ux2eXI7qOzb51Tw+HWfCPjo5HA/BvQlDUtXrXSXnVY8l1eMvYT8A5y/frv1dqp6FyTI8Jk2Gixho855zPWf+bgw5mTRh4tmTk2KuquPSlJ9iPd1ldNUrbZxhCCblKT2SXeVRxzxPLWcj3riuUcGqXLsdj+M/DuR94XDVYivSOHNo7T7SWMiws3Kt9yfu09Z6z4Rz+TncV63drmqSyJbxph5tNfxY+1nIAOooopopimnhDzVjMXexl+q/fq1qqnWZAAfTWAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAkvBvFN+iWrHv6VuDJ+dDtrffH2EaBju2qbtPZqjc3suzLE5biKcRhquzVH/NJ6wvzCysfNxoZOLbG2qa3jKLMxSnDfEGdoeR08efTpk/2lMn5svY/EtXh3iDT9bo6WNZ0bkt50zfnR9q8TncVgq7E6xvpegtmNs8JnVMW6/cvc6evjT18uMfq6xHOM+JqdDx/I09G3OsXmQ7IL40vZ2jjPianQ8byNLjZnWLzIdkF8aXsKlyb78zKnffZK26yW8pPm2zNgcD3vv18PVE7a7axltM4LBTrenjP5f7vQyb78zJnffZO66yW8pPm2zNnabn4PR9+Yd1HSW6c4NJlgcB8JLDUNT1OtPIfOqqS/d+L8fUTS2uu2DhbXGyD64yW6Zt3szpt19miNYj/m5y+UezfEZhhJxGLuTRcq3xExr8aues/OOe/dFAAuDUeDdBzG5LFePN/wBVMuj+HUcDM9zjnvh6ly7ra/zRlt5lYq4zoicb7Oc6w8/u6YuR/LP0nRXwJZfwDrsN+g8W1eFmz/FGpPgviKL2WCpeiyPtNiMVZnhVCAu7MZxanSrDV/8AbM+iPAkMODOIpPngqPpsj7Tap4B12e3T97VLxs3f4ITirMcaoLezGcXJ0pw1f/bMeqKAsDD9zh7p5mpLbuqr/Nnf03gvQcPaUsZ5M123S3/DqNevMrFPCdU/gvZznWJn95TFuP5p+kaqr07TM/UbFXhYttz74x5L0vqRNdB9z17xt1i/ZdfkaX65ez7Sf01VU1qumuFcF1RjHZHsjr2Z3K91G5YOT+zbLsHMXMVM3auk7qflz+M6eDXwMLEwMeOPh49dFS/pitvt72bABHTMzOsrDt26LVMUURpEcIjdAYsvJoxMeeRk2xqqgt5Sk9kjQ4g13T9Fx/KZdu9jXmVR5zl9XYvEqribiLO1y/e6Xk8eL/Z0xfmrxfezcwuCrvzrwjq5HabbLB5JRNume3e5Uxy8aunlxn9W/wAacV3azN4mL0qsCL6up2vvfh4EXAOitWqbVPZpjc8+ZlmeJzPEVYnE1dqqf08I6QAAyNAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAyY91uPdG6iydVkHvGUXs0zGBxftNU0zFVM6TDLlX3ZWRO/ItlbbN7ylJ7tsn/ubcPYbqhq+RbTkXddVcZKSq8X871enqrsz4WZlYVyuxMiyixdsJbGviLVVy32KJ0TuQZrh8vx9OLxdrvdN/HhP5t/GfPz4r7BWej+6Dm0JV6jjwyYr+uHmy9jJbpnF+hZ2yWWqJv+m5dH8eo567gr1rjGvkv3LNssnzGIi3eimrpV7s/run4TLvg8VWV2wU6rIWQfVKL3TPZquniYqjWAAB+gAAAHm2yuqDnbOMIrrlJ7JB+TMRGsvQODqfF2hYO6lmK+a/opXS/Hq/EiWr+6FmXJw03Ghjxf9dnnS+zqRtWsFeu8Kfm5nM9scny6Ji5eiqrpT70/puj4zCw8/NxMGh35mRXRWu2ctiCcRcftqVGi17Lq98WR5/8Atj7fsIRnZuXnXO7MyLL5vtnLfb0dxrktYyy3Rvr3z+irM89pGNxsTawUd1R141T8eXw3+LJk33ZN8r8i2dts3vKU3u2YwCTiNFcVVVVzNVU6zIAA+QAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABnxcvKxZqeNk3UyXbCbj6jr4vF/EOOko6jOxf+pFT/ABa3OCDHXaor+9ES3sLmeMwn/T3aqPKqY9JS+n3Qdbgtp04dvjKtp/gzYj7o2obedp+K/Q5IhAMM4KxP4Uxb2yzy3GkYmr46T6wm8vdG1H+nT8Velyf5mvd7oOtzW0KcOrxjXJv8WRACMFYj8Jc2yzyuNJxNXw0j0h3sri/iHITUtRnWv/TiofilucjKzMvKm55OTddJ9s5uXrMAM1Fqij7sRCHxWZ4zF/8AUXaq/OqZ9ZAAZGiAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABYOFp2BLDplLDobcE23Bc+RXxZeB/A0fRx9QGP8ARmn/AOSo+4h+jNP/AMlR9xGfKujj49l803GEXJ7dZxP1pwPkrvsQHU/Rmn/5Kj7iH6M0/wDyVH3Ecv8AWnA+Su+xD9acD5K77EBFdUjGGpZMIRUYxtkkl1JbsnOJp2BLEplLDobcItvoLuIHnWxvzb7oJqNlkpLfubLGwv4Oj6OPqA5+safg16XkzhiUxlGttNQW65EDLG1v+UZf0UvUVyAAAA7+jcN3ZMY3ZknTU+aivhP2GTg/So3zedkR3rg9q4vqb7/qJeBo4mkadjJeTxa21/VJdJ/ibfkqttvJw+6jDn52Lg19PJtUN+pdbfoRyJcV4SnsqL2u/Ze0DrZOn4OQtrsWqXj0dn9pwNV4XSi7dPm91/hTfqftO1purYWe+jRbtZ8SS2ZvgVfZCddkq7IuMovZprZpkp4Ppw8rBshdjU2WVz65RTezNji3S45GNLNpjtdUt5bf1R9qORwZkeR1XyTe0bouP1rmgJX+jNP/AMlR9xES4vxK8XUoumuNddkE0orZbrr/ACJwRzjmjpYdN6XOE+i34P8A+gIgS7hHTsezTZX5FFdjnN9Hpx35L/rIiWRpNHvbTcejbZxrW/p63+IGLJ0nBsxra4YlMZSg1GSgk09uTK9kmm01s1yZaJXvENHvfWcmtLaLn016Hz/MDUxKnflVUr+uaj9rLBWmaelt7yo+4iIcJU+W1qpvqrTm/V+ZOwObnYenY2HdkPCx/wBnBy+AuvsIA3u2yacaZHktLVKfO6e31Ln7Di8KaWs7Jd90d6Kn1fGl3AfNF4fyM6KuuboofU9vOl6F+ZJ8PRdNxUuhjRnJf1T85nQSSWyWyRiy8qjEpduRbGuC7X2ge1VUlsq4Jf2ow5GDh5Edrsaqfpijk2cVYMZ7Qpvmu/ZI6Gm6vhZ76NNm1nxJcn/yBxdX4YioSt09vdc3VJ77+hkXlGUJOMk4yT2afYWiRbjXAqUY51bjGbfRsjv8LxAix1NG0XJ1F9NfsqE+djXX6F2nnh7TnqOcoT38jDzrH4dxPq4QrrjXXFRjFbJLqSA5uFoOm40V+wVsvjWc/wAOo6EaaYraNUEvCKGRdVj1O26yNcF1ts4t/FOBCW1dd1q70kvWB17sTFuj0bceqa8Yo4+pcMYt0XLEk6LO584v2GzgcQaflzVfTlTN9SsW2/1nWArTOxL8K905FbhNfY13owFia1p1Wo4cqpJKyPOuXc/YV7bCdVkq5royi2mu5gSrg3ExcjTrZ349Vklc0nKKb22R2/0Zp/8AkqPuI5XA38ru+nf+2JIAK51qEK9WyoVxUYxsaSS5I0zd17+c5f0svWaQAA3dFwJahnwoW6h1zkuxAe9H0nK1Kf7NdCpPzrJdS9HeyV4PD+nY0V06vLz7ZWc/w6jp49NePTGmmChCC2SR9tsrqrlZbOMIRW7beyQHyFFMFtCmuK7lFHm3FxrY9Gyiqa7nFHIyeJ9Pqm41xtu27YrZfiZMLiPTsiahKUqJPq6a5faB41HhrCyIuWPvj2dm3OP2ET1HBycC/wAlkQ2f9Ml1SXgyx001unuma2qYNOfiSotS584y7YvvArck3BeLjZFWS76K7XGUdulHfbrI9lUWY2RZRatpwlsyT8B/ucv+6P5gdv8ARmn/AOSo+4iGcUVV061dXTXGuCUdoxWy+CifEE4u/n13oj/tQHIPq60fD6utAWHRpunuitvDobcV/Qu419Y0/Br0rKnDEpjKNUmmoLdPY6WP/D1/2L1Gtrn8ny/oZeoCuiwsTTsCWJTKWHQ24Jt9BdxXpZmF/B0fRx9QGL9Gaf8A5Kj7iH6M0/8AyVH3EZsu+ONjWXzTca4uT26zi/rTgfJXfYgOm9M05rZ4VH3EaOfw5p+RFumLx7Oxx6vsPWFxFp2TcqulOqUnsumuT+s7AFb6lg34GS6L47PrjJdUl3o1Sd8WYccnSZ2bLylPnxfh2oggAAAAAAAAAAAAAAAAAAAAAAAAAAACy8D+Bo+jj6itCy8D+Bo+jj6gPOp1zu0++quPSnKtqK72Qn9Aav8A5N/fj7SfgCAfoDV/8m/vx9o/QGr/AOTf34+0n4YFXSi4ycZLZp7MsvC/g6Po4+orjK/irf736yx8L+Do+jj6gMOt/wAoy/opeorksbW/5Rl/RS9RXIA+pNtJdbPhmwtnmUJ9XlI7/aBYmnY8cXBpx49UIJPxfaz3l3Qxsay+z4NcXJmVHL4qcloWRt4b+jdAQnPy7s3KnkXS3lJ8l2JdyNcAD1XOddkbK5OMovdNdaLB0HO/SGmwult5RebP0orwl3AjfvXJXZ01t9gEjaTTT5ple3p6ZrklHkqbt16N9/UWGQLitJa7ft83f7EBO4SU4RnHqkt0aPEVHvjRsiG27UekvSuZ44YyPfGjUtveUF0H9X/B0bIqcJQl1STTArrRqPfOqY9O26lNN+hc3+CLHIjwjhuGs5MpL9wnHn3t+xMlOVaqMa26T2UIuQHuucbIKcJKUX2oinHVHRyaMlL4cXB/V1es6XB2S79MnGT86Fj3+vme+L8fy2jTmlvKqSmvU/WBzuBKf4nIfhBet/kSk5HCVHkdFqbXOxuZ1pNRi5PqS3YEM41yPK6nGhPlVDb63zJJw9jrG0fHhttKUenL0vmQTUL3k5t17e/Tm2vR2FkUJKitLq6K2+wD1OUYQcpPaKW7fcivNa1CzUM2dsm/Jp7Vx7kTjWnJaTlOPX5J+orkAeq5zrsjZXJxnF7prrTPIAkORxTlSxoQpqjCzo7TsfPd+COFkX3ZFjsvtnZJ9snuYwBOODsZU6RG3bzrpOTfguSO0aOgpLRsXbq8mjcsbVcnHr2ewEF4m1GednzhGT8hU3GC7H3s5IAAmXB2ozyceeJdJynUt4t9bj/wQ07fBbf6Z5dTqlv+AE3ITxnjKnVfKxWyuj0n6epk2Irx4l08V9u0vyA2uBv5Xd9O/wDbEkBH+Bv5Xd9O/wDbEkAFda9/Ocv6WXrNI3de/nOX9LL1mkAJjwRjKGBZktedZPZehEOJ9wqktCx9vnb/AHmB1CE8XajPJzpYsJNU0vZpdsu1k2KzzG3mXOXwnZLf7QMIAAlfBeozs6WBdJy6K6Vbfd2ok5AeFW1r2Pt29Lf7rJ8BD+OMZQzKcmK28pHaXpRtcB/ucv8Auj+Z647296Yz7fKP1HngP9zl/wB0fzAkxBOLv59d6I/7UTsgnF38+u9Ef9qA5B9XWj4fV1oCzcf+Hr/sXqNbXP5Pl/Qy9Rs4/wDD1/2L1Gtrn8ny/oZeoCuizML+Do+jj6isyzML+Do+jj6gMGufyfK+iZXRaFsIW1yrsipQktmn2mn+idN/yVP3QK9qhOyyMK4uU5PZJdbZZmNGcMaqNj3moJS9OxjxsHDxpdOjGqrl3qK3+02ANbVHFabkuXV5KW/2FbE04x1CFGC8OEv2t3Wl2R/5IWAAAAAAAAAAAAAAAAAAAAAAAAAAAAsvA/gaPo4+orQsvA/gaPo4+oD5qVs6dPvtre04Qbi9u0hn6x6t8vH/AE0TDWf5VlfRS9RXAHX/AFj1b5eP+mh+serfLx/00cgAfZyc5ynLrk92WXhfwdH0cfUVmWZhfwdH0cfUBh1v+UZf0UvUVyWZmULJxLcdycVZFx3XZucD9Uqf87Z9xe0CJH2MnGSkutPdEs/VKn/O2fcXtObr+iV6ZiwujkSscp9HZx2AmWJdHIxar4fBnBSX1nnUMdZeFdjS5eUi1v3PsI/wZqUeh+jrpbNNupvt70ScCscimyi+dNsXGcHs0zGWDq2kYmorpWxcLUtlZHr+vvOLLhKzpebmRcfGHMCMLm9kT7hnClg6XGNi2ssfTku7uRj0rh/EwbFdNu+1dTktkvQjsACudavWTquTdF7xc2l6Fy/Il3FGpxwcJ1Vy/b2raKX9K7WQUCT8C5G08jFb60rIr8H+RKyveHsj3trGPY3tGUuhL0PkWEBq4eJHHvybVzd9nT/A0uLb/I6LZFPZ2NQX5/gdcinHd+88fGT6k5tfgvzAxcDX9DOux31WQ6S9K/8AsleXSsjFtol1WQcftRANAv8Ae+sY1m/LpqL9D5fmWIBiw6Vj4lVC28yCjy8EafEmR720a+ae0pLoR9L5HRItx3kfw+In32SX4L8wIsWLod6ydJxrU930EpelcmV0SLg7U40XPBultXY94N9ku76wJbbCNtU6584zi4v0MrnUcSzCzLMe1bOL5PvXYyyTT1PTcXUalDIhzXwZx5SiBXIXN7IlFnCUun+zzF0fnQ5nR0nh/EwbFdOTvtXU5LZR9CAjeRoGo040L1V5RSjvKMfhR9KOW002mmmutMtEi/G1mHGEKlVB5UubmlzjHxA6PCV6u0WuO/nVNwfr/M65BeFtSWDmuu2W1N3KT7n2MnKaa3XNAV7r2DPA1Gytxark3Kt9jT9hoFk6hhY2dR5HJr6S7GuTi+9Mj9/CXnb05nm904819gEWJZwTgzhCzOsi1010a9+1drMuBwtjVTU8q6V+39KWy+vvJBGMYxUYpRilsklyQH0hnG16s1KFKf7qHP0slWpZlWDhzyLXyivNXbJ9iK7yrp5GRZfY95zk2wJbwN/K7vp3/tiSAj/A38ru+nf+2JIAK617+c5f0svWaRM83hmrKy7ch5c4uyTlsoLluYf1Sp/ztn3F7QIkTTgq9WaXKnfzqpv7Hz9pqX8K01UWWe/Jvoxctuguxek5HDuofo/UFOb/AGU/Ns9HeBYBA+KcGeJqdlii/JXNzi/F9a+0ncJRnFSi1KLW6a7TFmYtGZQ6citTg+/s8UBWYJVk8Jxc28fLaj3Tjvt9aMmFwrRCallXytS/oitk/rA1uCcGUr55047QinGG/a+0lp5qrhVXGuuChCK2UUuSMeZk1YmNPIul0YQW78fACMcdXqV+PjJreCc39f8A9GXgKS6OXDt3g/WR3UcqebmWZNnXN8l3LsRv8KZkcTVYqx7V2roNvs7vxAnZCONKZV6x5VrzbYJp+jkTc1NT0/H1DH8lkRfLnGS64vwArg90VytuhVBOUpSSSXaySWcJT6f7PMi4/OhzOpo2g42n2eWcndcuqTWyj6EB1a49CuMe5JGnr8lHRctv5Nr7eRvEe42zI14UMOL8+1qUl3RX/PqAhxZmF/B0fRx9RWZZmF/B0fRx9QHrJuhj4877N+hCPSe3cc3F4h07IyIUQlYpTey6UdlubOufyfK+iZXcW4tSTaa5poC0Tm8Q5WXh6fK/FhFtPaTa36K7zJoeas/Ta72/PS6Ni+cv+7m5bCFtcq5xUoSTTT7UBWV9tl9srbpuc5Pdyb6zwber4U8DPsx5buKe8H3xfUagAAAAAAAAAAAAAAAAAAAAAAAAAAACy8D+Bo+jj6itD7u+9gWLrP8AKsr6J+ork+7vvZ8AAAAWZhfwdH0cfUVmfd33sC0QVdu+9jd97AtEj/HH8tq+l/JkO3fexu+8BCUoSUotxknumuwlWjcTQcY06jumuStS6/SiKACzse+nIh06LYWR74y3MhV8JzhLpQlKL709jOtQz0tlm5KXd5V+0Cx7Jwrg52TjCK63J7I4mq8SYuPFwxGr7e9fBX19pDbbbbXvbbOb75SbPAGXLyLsq+V983OcutsxAAfU2nuutFk6bkLKwKMjfnOCb9Pb+JWp93fewLRIDxRf5fWr2nvGvaC+rr/Hc5m772fAPqbTTT2aLLwblkYdN6/xIKX2orM+7vvYFolf8S5HvnWb5J7xg+hH6uXr3Odu+9nwAAAJLonEjqhGjPUpxXJWrm16e8k+LlY2VDp498LF81819RWZ9jKUXvFtPvTAtE+TlGEXKclGK623skVvHPzoraOZkJdysZitvuue9t1ln90mwJjq/EeNjRlXiNX3dW6+DH6+0h2RdZfdK66bnOT3bZjAA72hcQ2YcY4+UnbQuSa+FH2o4IAsnDzsTMinj3wn83fmvqNkq5Np7p7GeGdmwW0MzIiu5WNAWU+S3Zy9S13Aw4teVV1nZCt7/a+pEGtyci5bW322f3TbMQG7q2pZGo3+Uue0V8GC6omkABMuBv5Xd9O/9sSQFXbvvG772BaIKu3fexu+9gWXnfwV/wBHL1FZn3d97PgHZ0LXbtPSpuTtx+xb84+j2EuwdSws2KePkQlJ/wBLe0vsK4HUBaQK1rzcytbV5d8V3Kxo825WVatrci6a+dNsCd6jrOBhRfTuVk+yEHu/+CHazq2RqVu8/Mqi/NrT5L097OeAAAAlGg8RxhXHG1Bvlyjb1/b7STUX03w6dNsLI98XuVieoTnCXShOUX3p7AWgfG1FNtpJdbZW61DPS2WbkpfSsx25F9v726yz+6TYE11XiDCw4ONU1kXdkYvkvSyF5mTdl5M8i+XSnJ8/DwMIAFmYX8HR9HH1FZn3d97AsTXP5PlfRMro+7vvZ8A7nB+d72z/AHvOW1d/L0S7CbFWn3d97AmvF2n++8H3xXHe2jny7Y9qISfd33s+AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD1BRc4qT2jvz9B5AExjwtgyipK+7ZrddRr6nw1j0YF11FtsrIR6ST25nT4Xzo5mmwi5ftaV0Jrt8GdVpNNNbpgVcCS6vwzcrpW4HRnCT38m3s4+jwI4q5ubgoNyXWktwOxw5pmFqUbIW22Quhz2i1zXedj9VcL5e78CM6fZl4WXDJqqs6UXzXRfNdqLAwsiGXjQvrTSkuprZp9zAhHEWlfoy+Hk3KdM15sn39qOUWRqmFVn4c8e3lvzjL4r7GQDKwsnGyJ02Uz6UHs9otpgaxmwcazLyq8epbym9vR4nnyF3yNn3WTLhXSveWP75vjtkWrqf9Ee70gY1wphbc77vwNbU9A07BwrMmy+7zVyW65vsRKXyW7ITxPnXZ+T5Kmuz3vU/N81+c+8Dhg9yrsgt5Vziu9rY8AD1GE5LeMJNeCPJNeC0v0O99v3jAhvkrfk5/dY8lb8nP7rLO2j3IbR7kBWPkrfk5/dY8jb8lP7rLO2j3IbR7kBCND0K/Nsc8mFlNCXW1s5Pw3Ox+quF8vd+B390u1Gpm6lhYcW78iCa/pT3k/qAjPEOi4mm4StrtslZKajFS2+sj50dd1Sep5Sns4VQ5Vx7vF+JpU0X3SUaqbLG+yMWwMZ0NC02epZir86NUedkl2I3tN4ZzL2pZTWPX3PnJ/V2fWSzAw8fBx1Rjw6MV1vtb72Bx/1Vwvl7vwNPWNCwMDAsyHda5LlBPbmyU22QqrlZZNQhFbtt8kQXiPVXqWSlXusev4Cfb4gcoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD3V0PKw8p8DpLpegDLp+Zfg5Kvx59GS612NdzJjpvEODlRUbpLHt7VLq+piPDukyipKmezW6/aM1tX4ewq9Ousxapq2EekvOb6gO/XZXYt67ITXfF7kQ4TnCGuZDnOMV0Zc29v6kcBSlHqk16GfALN98Y/y9X30PfGP8vV99FZ8/E7mgaFdl2K7LhOvGXPZ8nP0eHiBMPfGP8vV99D3xj/L1ffRzP1b0v5Oz/UZxOJ8PTNPhCnGjL3xLm95t9GP/IEu98Y/y9X30PfGP8vV99EA0RYdmdGrOTdc+SkpbdF9hLP1b0r5Oz/UYHT98Y/y9X30PfGP8vV99Ed1rhuCx1Zp0ZdOPwoOW/SXh4kXshZXNwsjKEl1qS2aAmPGNtU9H2hbCT8pHkpJkLAAHY4bwf0hO6p5dtHQSklB9ff+Rxze0TOen6jXkPdw+DNLtiwJJ+rb/wDM8n/v1kYslfVmSosyLoqNnRk+k90tyxKba7qo21TU4SW6a7ThcUaPj20XahBuu2Ed5bdUv+QH6tv/AMzyf+/WcLXse/TcxURyrpxcFJScmiVcOahDO06G8v21aUbF2+n6xr+l0ahj9ObcLK4txmvUwITjyyMnIro8tY3ZJR+E31kk/VKj/OWfcR94Q0uhY9epTbnbLpKKfVHZtfaSG6yFNUrbJKEIrdt9gEF1/TKtMyKaoXStc10nuttlvy/MnOPGMaIKKSXRXJIr/W855+pWZC3UPgwT7IrqNqziPVJRUYWQrSW3mwX5gTmTUU5SaSXW2crUdfwMROMbPL2L+mvmvtIXk5uXkv8Ab5FtnhKXIafi2ZmZXj1rnN833LtYGxq+r5eoy2sl0Kl1Vx6vr7znkt/VKn/OWfcRiyuGcbHxrL7M2ajCLb81ARcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABOuFdQjmafGmUv21K6Ml2tdjOw+a2ZWeHk3YmRG+ibhOPb+RLNO4nxLYqOZF0Wdskt4v80Bh1XhjylsrsGyMOk93XLqT8GavDGkYefi2W5Km5Qs6KSlsttkSWvUcCxbwzaH//AGLcifD2pZlEnhYdNVk7ZuSc2+7/AIAlWJpen4rTpxa1Jf1Nbv8AE25zjCLlOUYxXW29kcK/9aLPgxxqv7WvzOZlaNr2S98izyn91vIDpaxxJRRGVWFtdb8f+mPtIhfbZfdK22bnOT3lJ9p1v1a1X5Ov/UQ/VrVfk6/9RAcYkWhcRSx4xx83pWVLlGa5yj6e81v1a1X5Ov8A1EP1a1X5Ov8A1EBM8XKx8qvp490LI/NZ8ysTFyo7ZFFdnjJc/tIfDQNaol06YqMl2wtSZlnn8RadH/xEbHBds4qS+1AdPU+H9Nhi3XV1zhKEHJJT5b7eJDDu3cTZd2PZTZRRtOLi2t0+f1nCAAEl4Z0fCz8CV2RCbmptcpNcgORpmq5mnvaizet9cJc1/wAHVy+JFl6fdjWYrjOyPRTjLdHW/VrS/k7PvsLhrS9/3dn32BwcPSdcxL1dj1OE13SXNdzO9DL1f3vOGTpibcWnKFiXZ3M7J8klKLi+prYCHaZxDHA0yvFjjOc4OW7ctlzbf5nO1TVszUHtdNRrT5QjyX/JKv1a0v5Oz77H6taX8nZ99gQYEj4n0jCwMOqzGjOMpWqL3lvy2Z0cLhnT4RjO12XNpPaT2X4ARPBwsnNtVeNU5vtfYvSybaDpFWm1Ntqd8l50+7wR0KKaqK1XTXGuC7IrYX3VUVO26yNcF1uT2AyEQ4u1aN8veOPLeuL/AGkl1N9w13iOV8ZY+D0oVvlKx8nL0dyI4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACVaPw9h5Wm05F7uVk1u1GSS6+XZ3EaxKJ5OTXRWt52SUUWVRVGmiumHwYRUV6EBxXwvpiTbnkJL569hGdFyKcTVq77HJVRk+zd7E04gyVi6RkWb7ScehH0vkQ/hhJ63jppNbvr9AEn/WTS/lLf9Nj9ZNL+Us/02dXyVXycPuojvHMIRxMfoxiv2j6l4AdrTdRxtQhOWNKUlB7PeOx61HNx8ChXZMpKDl0Vst+Zw+A/wCFyv716jPxv/Ka/pl6mB0NN1TE1Cc4405ScEm947GbPy6cLHd+Q2oJpbpb9ZGuA/4jK/sj62dTjH+Rz/vj6wN7TtRxM+MnjW9Jx64tbNG1JKUXGSTT5NPtIdwN/MrvovzRMgIDxNh14WqyhUujXNKcV3b9hyzv8cfzOr6JetnAAHU0rW8rT8d0U11yi5dLzk9zlm1pVDydSx6Ut+lNb+jrf4ASD9M67/5d/wD5yMd3EGr0dF34cK1J7Jyi1uSwifHGQpZWNjJ7uC6T+v8A+gJWuo+WNxrlJdaTZ9XUjzf+5n/a/UBFqNf1e9OVGFCxJ7Nxi2ZHrOupbvTl/pyPnAty6eVjt83tNep/kSkCA6prWTqNUKb4VxjCalvFP0fmSKXEmm1VRUZWWSSS2jH2kQz6JY2bdRLrhNowASTM4ruknHFx41/Om939hwszLycuzp5N07H2bvkvQjAdzhnRp5l0cnIg1jwe63/rfsA50dM1CUVJYdzT5rzT7+i9R/yV33Sxjn69qEdPwJ2b/tZLo1rx7/qAr6UXGTjJbNPZo+H2TcpNt7t82z4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPVcJWWRrgt5SaSXieTPp38fj/Sx9YEw4c0Raf/4jIalkNbLbqgvadsxZGRTj1uy+2Fce+T2IvrvEbthLHwN4wfKVr5N+juAw8X6lHKyViUy3qpfnNdsv+DT4X/nmP6X6mcwnnCsIfoPGn0I9Lzue3P4TA6xG+O/4TG+kfqJIeZwhPlOMZbd63AjnAf8ADZX969Rn43/lNf0y9TO5CEIb9CMY79y2EoxmtpRUl4rcCKcB/wARlf2R9bOpxj/I5/3x9Z14QhD4EIx37lsfZRjJbSipLuaAh3A/8yt+i/NEyPMK64PeMIxfgtj0BDOOP5nV9EvWzgFj6tCD0/Ik4RbVUtm14FcACa8K6VDFojmTkp22wTXdFP8AMhRK6uJMXF06mmqudtsa0n2RT2A7+fl04WLPIuklGK5Ltb7kV7mZNmZmzyLfhTlvt3eBk1PUcrULvKZE+S+DBdUTUj8JekC0F1I83/uZ/wBr9R6XUjzf+5n/AGv1AV3pWZLA1CGTHmovaS712lh419WTRC6manCa3TRWT62b2larladPemSlW/hVy6mBIeLtKhdTPUK5KFlcfPXZJe04WHoepZKjKNHQhJJqU3stjrZvEOJm6TfRKE6rpw2SfNN+kkOnfy/G+ij6kBx9L4Yx6JKzMn5ea/pXKP8Ayd+KUYqMUkktkl2Grmalg4ifl8muLX9Ke7+xHA1LiltOGBV0f/Un1/UgO9qmpY2nU9O+fnP4MF1yIJqmffqGU77n4RiuqK7jBfdbfa7brJWTfW5MxgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPsZShJSi2pJ7prsPgA93W23T6dtk7Jd8pbs8AAD3GyyK2jZJLuTPAA9+Wt+Vn95jy1vys/vM8AD35a35Wf3mPLW/Kz+8zwAPflrflZ/eY8tb8rP7zPAA9+Wt+Vn95jy1vys/vM8AD27bWtnZNr+5ngAAAAAAA9+Wt+Vn95jytvys/vM8AAAABnnmZc4KueTdKCWyi5vZL0GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAH/9k=" alt="FLOWCOLOUR" style={{ height: 36, objectFit: "contain" }} />
              <span style={{ color: "#e2e8f0", fontWeight: 700, fontSize: 16 }}>煦彩国际业务销售管理系统（测试）</span>
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
