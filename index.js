const db = firebase.database();

const annRef = db.ref("announcement/latest");
annRef.on("value", (snapshot) => {
  const content = snapshot.val();
  document.getElementById("announcement-content").innerText = content || "目前尚無公告。";
});

const candidateListRef = db.ref("candidates");
const listElement = document.getElementById("candidate-list");
candidateListRef.on("value", (snapshot) => {
  const data = snapshot.val();
  listElement.innerHTML = "";
  if (data) {
    Object.entries(data).forEach(([id, candidate]) => {
      const li = document.createElement("li");
      li.innerHTML = `🧑‍💼 <strong>${candidate.name}</strong>（${candidate.party || "無黨籍"}）<br>📜 政見：${candidate.policy || "未提供"}`;
      listElement.appendChild(li);
    });
  } else {
    listElement.innerHTML = "尚無候選人。";
  }
});