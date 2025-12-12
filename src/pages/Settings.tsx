import React, { useEffect, useState } from "react";

type Tab = "general" | "password";

export default function Settings(): JSX.Element {
  const [tab, setTab] = useState<Tab>("general");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [confirmForUpdate, setConfirmForUpdate] = useState("");
  const [loadingGeneral, setLoadingGeneral] = useState(false);
  const [generalMsg, setGeneralMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

   const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loadingPassword, setLoadingPassword] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const BASE = "http://localhost:5000";

   useEffect(() => {
    async function loadProfile() {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await fetch(`${BASE}/api/user/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) return;
        const data = await res.json();
        const user = data.user ?? data;
        if (user) {
          setName(user.name || "");
          setEmail(user.email || "");
        }
      } catch (err) {
       }
    }
    loadProfile();
  }, []);

   const submitGeneral = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralMsg(null);

    if (!name.trim() || !email.trim()) {
      setGeneralMsg({ type: "error", text: "Name and email are required." });
      return;
    }
    if (!confirmForUpdate.trim()) {
      setGeneralMsg({ type: "error", text: "Please enter your password to confirm." });
      return;
    }

    setLoadingGeneral(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BASE}/api/user/update`, {
        method: "PUT",  
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          password: confirmForUpdate.trim(),  
        }),
      });

      const body = await res.json();
      if (!res.ok) {
        setGeneralMsg({ type: "error", text: body?.message ?? "Failed to update profile." });
      } else {
        setGeneralMsg({ type: "success", text: body?.message ?? "Profile updated successfully." });
        setConfirmForUpdate("");
         if (body?.user) {
          setName(body.user.name || "");
          setEmail(body.user.email || "");
        }
      }
    } catch {
      setGeneralMsg({ type: "error", text: "Network error. Try again." });
    } finally {
      setLoadingGeneral(false);
    }
  };

   const submitPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMsg(null);

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordMsg({ type: "error", text: "All password fields are required." });
      return;
    }
    if (newPassword.length < 6) {
      setPasswordMsg({ type: "error", text: "New password must be at least 6 characters." });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMsg({ type: "error", text: "New password and confirm password do not match." });
      return;
    }
    if (currentPassword === newPassword) {
      setPasswordMsg({ type: "error", text: "New password must be different from current password." });
      return;
    }

    setLoadingPassword(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BASE}/api/user/change-password`, {
        method: "POST",  
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({ oldPassword: currentPassword, newPassword }),
      });
      const body = await res.json();

      if (!res.ok) {
        setPasswordMsg({ type: "error", text: body?.message ?? "Failed to change password." });
      } else {
        setPasswordMsg({ type: "success", text: body?.message ?? "Password changed successfully." });
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch {
      setPasswordMsg({ type: "error", text: "Network error. Try again." });
    } finally {
      setLoadingPassword(false);
    }
  };

   const container: React.CSSProperties = {
    padding: "20px",
  };

  const titleStyle: React.CSSProperties = {
    textAlign: "center",
    fontSize: "32px",
    marginBottom: "20px",
    borderBottom: "2px solid #313131ff",
    paddingBottom: "10px",
  };

  const headStyle: React.CSSProperties = {
    textAlign: "center",
    fontSize: "22px",
    marginBottom: "20px",
  };

  const panelWrapper: React.CSSProperties = {
    display: "flex",
    gap: "20px",
    alignItems: "flex-start",
  };

  const leftPanel: React.CSSProperties = {
    minWidth: "200px",
    borderRight: "2px solid #313131ff",
    paddingRight: "25px",
    paddingLeft: "10px",
  };

  const buttonStyle = (active: boolean): React.CSSProperties => ({
    display: "block",
    width: "100%",
    padding: "12px",
    borderRadius: "6px",
    background: active ? "#e7edffff" : "transparent",
    cursor: "pointer",
    border: "none",
    textAlign: "left",
    marginBottom: "8px",
  });

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #383838ff",
    marginTop: "5px",
    marginBottom: "15px",
  };

  const messageBox = (type: "success" | "error"): React.CSSProperties => ({
    marginTop: "15px",
    padding: "10px",
    borderRadius: "8px",
    background: type === "success" ? "#e6f9ee" : "#fdecea",
    color: type === "success" ? "#056644" : "#b02318",
    border: type === "success" ? "1px solid #9ae6b4" : "1px solid #f5a5a5",
    marginBottom: "15px",
  });

  return (
    <div style={container}>
      <h2 style={titleStyle}>Settings</h2>

      <div style={panelWrapper}>
        <div style={leftPanel}>
          <button style={buttonStyle(tab === "general")} onClick={() => setTab("general")}>
            General Info
          </button>
          <button style={buttonStyle(tab === "password")} onClick={() => setTab("password")}>
            Update Password
          </button>
        </div>

        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {tab === "general" ? (
            <>
              <h2 style={headStyle}>Update General Information</h2>

              {generalMsg && <div style={messageBox(generalMsg.type)}>{generalMsg.text}</div>}

              <form style={{ maxWidth: "520px", width: "100%" }} onSubmit={submitGeneral}>
                <div style={{ display: "flex", gap: 20 }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: "block", textAlign: "left" }}>
                      Name
                    </label>
                    <input style={inputStyle} value={name} onChange={(e) => setName(e.target.value)} />
                  </div>
                </div>

                <div style={{ display: "flex", gap: 20 }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: "block", textAlign: "left" }}>
                      Email
                    </label>
                    <input style={inputStyle} value={email} onChange={(e) => setEmail(e.target.value)} />
                  </div>
                </div>

                <div style={{ display: "flex", gap: 20 }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: "block", textAlign: "left" }}>
                      Enter password to confirm
                    </label>
                    <input
                      type="password"
                      style={inputStyle}
                      value={confirmForUpdate}
                      onChange={(e) => setConfirmForUpdate(e.target.value)}
                    />
                  </div>
                </div>

                <div style={{ textAlign: "center", marginTop: 8 }}>
                  <button
                    disabled={loadingGeneral}
                    style={{
                      background: "#2563eb",
                      color: "white",
                      padding: "10px 18px",
                      borderRadius: "6px",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    {loadingGeneral ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </>
          ) : (
            <>
              <h2 style={headStyle}>Change Password</h2>

              {passwordMsg && <div style={messageBox(passwordMsg.type)}>{passwordMsg.text}</div>}

              <form style={{ maxWidth: "520px", width: "100%" }} onSubmit={submitPassword}>
                <div style={{ display: "flex", gap: 20 }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: "block", textAlign: "left" }}>
                      Current Password
                    </label>
                    <input
                      type="password"
                      style={inputStyle}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                  </div>
                </div>

                <div style={{ display: "flex", gap: 20 }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: "block", textAlign: "left" }}>
                      New Password
                    </label>
                    <input
                      type="password"
                      style={inputStyle}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Min 6 characters"
                    />
                  </div>
                </div>

                <div style={{ display: "flex", gap: 20 }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: "block", textAlign: "left" }}>
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      style={inputStyle}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                </div>

                <div style={{ textAlign: "center", marginTop: 8 }}>
                  <button
                    disabled={loadingPassword}
                    style={{
                      background: "#2563eb",
                      color: "white",
                      padding: "10px 18px",
                      borderRadius: "6px",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    {loadingPassword ? "Updating..." : "Update Password"}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}