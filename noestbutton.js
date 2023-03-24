let table = document.getElementById("myTable");
let body = document.getElementsByTagName("body")[0];
let container = document.createElement("div");
container.setAttribute("id", "overlay");
let modal = document.createElement("div");
modal.setAttribute("id", "modal");
let checkUser;
if (window.location.href.includes("/validation/orders")) {
  checkUser = 3;
} else {
  checkUser = 2;
}
//add buttons in every row of table
for (let i = 1; i < table.rows.length; i++) {
  let td = table.rows[i].children[checkUser];
  let text = td.textContent;
  let phoneNumber = text.match(/(\d){10}/)[0];
  let button = document.createElement("button");
  button.style =
    "background:#01BEA8;color: #fff;text-transform:uppercase;border-radius:10px;border:none;padding:0.5rem 1rem;font-weight: 400;letter-spacing: 1px;";
  button.innerHTML = "Show Details";
  td.innerHTML = text;
  td.style = "color:#01BEA8;font-weight: bold";
  td.appendChild(button);

  // button when clicked send phone number to server
  button.addEventListener("click", function () {
    fetch("http://localhost:8808/api", {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
      },
      body: JSON.stringify({ phone: phoneNumber }),
    })
      .then((response) => response.json())
      .then((data) => {
        // data recieved from server
        let percentage = Math.round(
          (data.cancelled / (data.cancelled + data.delivered)) * 100
        );
        // create modal for show data
        modal.innerHTML = `
        <table>
        <h2 style='text-align:center;background:#fff;margin:0;padding:15px 0px'>Client info </h2>
            <tbody> 
                <tr>
                    <td>Phone Number📞</td>
                    <td>
                    : ${data.phone}
                    </td>
                </tr>
                <tr>
                    <td>Full name 👤</td>
                    <td>
                    : ${data.name}
                    </td>
                </tr>
                    <tr>
                    <td>Address 🏠 :</td>
                    <td>
                    : ${data.address}
                    </td>
                </tr>
                <tr>
                    <td>Delivered Orders 📦 ✅</td>
                    <td>
                    : ${data.delivered}
                    </td>
                </tr>
                 <tr>
                    <td>Cancelled Orders📦 ❌</td>
                    <td>
                    : ${data.cancelled}
                    </td>
                </tr>
                 <tr>
                    <td>Risk ratio📦</td>
                    <td>
                    : ${percentage}%
                    </td>
                </tr>       
        </table>
        <style>
            #overlay{
               display: block ;
                position: fixed;
                z-index: 1; 
                left: 0;
                top: 0;
                width: 100%; 
                height: 100%; 
                 background-color: rgba(0,0,0,0.5);
            }
            #modal{
              position: fixed;
               top:50%;
               left:50%;
               transform: translate(-50%, -50%);
               max-width: 600px;
               shadow:0 2px 8px rgba(0, 0, 0, 0.3)
            }
            tr:nth-child(even)
            {
                background-color:#CAE0D3;
            }
           table{
            font-size: 1.5rem;
            background: #eee;
            border-collapse: collapse;
           }
           td{
            padding: 5px 10px;
           } 
            </style>
            `;
        // close button
        container.style.display = "block";
        const closeButton = document.createElement("span");
        closeButton.setAttribute("class", "close");
        closeButton.style.position = "absolute";
        closeButton.style.top = "10px";
        closeButton.style.right = "10px";
        closeButton.style.fontSize = "1.40625rem";

        closeButton.onclick = function () {
          container.style.display = "none";
        };

        modal.appendChild(closeButton);
        container.append(modal);
        body.append(container);
      })
      .catch((error) => console.error(error));
  });
}
// close modal when clicked outside modal
container.onclick = function (event) {
  if (event.target === container) {
    container.style.display = "none";
  }
};
