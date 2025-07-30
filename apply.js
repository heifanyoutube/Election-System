document.getElementById("apply-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const party = document.getElementById("party").value.trim();
  const policy = document.getElementById("policy").value.trim();

  if (!name || !policy) {
    document.getElementById("status").innerText = "❌ 請完整填寫必填欄位。";
    return;
  }

  const candidateData = {
    name,
    party,
    policy,
    timestamp: Date.now()
  };

  const db = firebase.database();
  const newRef = db.ref("candidates").push();
  newRef.set(candidateData, (error) => {
    if (error) {
      document.getElementById("status").innerText = "❌ 送出失敗，請稍後再試。";
    } else {
      document.getElementById("status").innerText = "✅ 已成功送出申請，請等待審查。";
      document.getElementById("apply-form").reset();
    }
  });
});