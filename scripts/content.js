chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {

     if (request.requestOwm === 'run') {

          document.addEventListener("dblclick", handleClickOnTarget);

          setTimeout(() => {
               setCopyIcon();
               mountTimeCopyTrigger();

               document.querySelector(".row.row-cols-xl-2 .btn-primary").addEventListener("click", startAsyasynchronouslyScript);

               document.querySelector(".datatable-body").addEventListener("scroll", setCopyIcon);
               document.querySelector(".datatable-body").addEventListener("scroll", mountTimeCopyTrigger);

          }, 1000);
     } else {
          try {
               document.querySelectorAll(".copyTriggerButton").forEach(item => item.remove());

               document.querySelector(".row.row-cols-xl-2 .btn-primary").removeEventListener("click", startAsyasynchronouslyScript);

               document.querySelector(".datatable-body").removeEventListener("scroll", setCopyIcon);
               document.querySelector(".datatable-body").removeEventListener("scroll", mountTimeCopyTrigger);

               document.removeEventListener("click", handleClickOnTarget);
          } catch (error) {
          }
     }
});

const reasonOfCanceletionArr = [
     "Водителю помог другой оператор технической поддержки",
     "В лог буке водителяя не оказалось ниодного нарушения, редактирование не потребовалось",
     "Невозможно помочь из-за ДОТ выгрузки лог бука водителя",
     "Водитель отказался от перевода его лог бука в ручные события",
     "Водитель передумал получать помощь со своим лог буком и сказалал что перезвонит позже",
     "Помощь требовалась другому водителю, суппорт по ошибке выбрал не того"
]

function setCopyIcon() {
     const tasksRows = document.querySelectorAll("div.datatable-row-center.datatable-row-group.ng-star-inserted");

     let copyTrigger;

     tasksRows.forEach((item) => {

          const extraType = item.querySelectorAll("div.datatable-body-cell-label > div.ng-star-inserted > div.ng-tns-c5-1 > span.ng-tns-c5-1")[1]?.textContent ?? "";
          const provideELD = item.querySelectorAll("div.datatable-row-center .datatable-body-cell > div.datatable-body-cell-label > span.ng-tns-c5-1 > span.ng-tns-c5-1");

          provideELD?.forEach(item => {

               switch (item.textContent.toLowerCase()) {
                    case 'trackensure eld':
                         item.style.fontStyle = "italic";
                         break;
                    case "alfa eld":
                         item.style.color = "red";
                         item.style.fontSize = "16px";
                         item.style.fontWight = "600";
                         break;
                    case "vista eld":
                         item.style.color = "blue";
                         item.style.fontSize = "16px";
                         item.style.fontWight = "600";
                         break;
                    case "swift eld":
                         item.style.color = "aqua";
                         item.style.fontSize = "16px";
                         item.style.fontWight = "600";
                         break;
                    default:
                         item.style.color = "rgb(255,0,255)";
                         item.style.fontSize = "19px";
               }
          });

          switch (extraType.toLocaleLowerCase().slice(1, extraType.length - 1)) {
               case "one time help":
                    return;
          }

          item.querySelectorAll(".datatable-body-cell-label").forEach(item => { //селектор типа таска
               item.querySelectorAll("span.ng-tns-c5-1").forEach(item => { //селектор текста таска

                    if (item.textContent < 1) return;

                    if (item.textContent === "LOG EDITING") {
                         const parent = item.closest("div.datatable-row-center.datatable-row-group.ng-star-inserted");

                         copyTrigger = document.createElement("div");
                         copyTrigger.classList.add("copyTriggerButton");

                         copyTrigger.innerHTML = `✏️`;


                         copyTrigger.style.cssText = `
                              cursor: pointer;
                              font-size: 18px;
                              text-align: center;
                         `;

                         if (parent.querySelector(".copyTriggerButton")) {
                              return;
                         }

                         parent.prepend(copyTrigger);
                    }
               });
          });
     });

     try {
          document.querySelectorAll(".copyTriggerButton").forEach(trigger => {
               trigger.addEventListener("click", handleTriggerClick);
          });
     } catch (error) {
          console.log(error);
     }
}
function pastTextToclipboard(reasonIndex, e) {
     const parentElement = e.target.parentElement;
     const collectionForTimeTask = [...parentElement.querySelectorAll("div.datatable-body-cell-label > div.ng-tns-c5-1")];

     const taskData = {
          id: parentElement.querySelector("span.ng-star-inserted").textContent,
          colleage: collectionForTimeTask.at(-2).textContent,
          companyName: parentElement.querySelector("div.datatable-body-cell-label > div.ng-tns-c5-1 > span.ng-tns-c5-1").textContent,
          driverName: parentElement.querySelectorAll("div.datatable-body-cell-label > div.ng-tns-c5-1 > span.ng-star-inserted")[1].textContent,
          taskTime: collectionForTimeTask.at(-3).textContent,
          taskType: parentElement.querySelectorAll("div.datatable-body-cell-label > div.ng-star-inserted > div.ng-tns-c5-1 > span.ng-tns-c5-1")[0].textContent,
          taskSubType: parentElement.querySelectorAll("div.datatable-body-cell-label > div.ng-star-inserted > div.ng-tns-c5-1 > span.ng-tns-c5-1")[1]?.textContent ?? ""
     };

     const { id, colleage, companyName, driverName, taskTime, taskType, taskSubType } = taskData;

     navigator.clipboard.writeText(`  ) Суппорт ${colleage} просит отменить таск
  ${companyName.trim()} / ${driverName}
  Task ID: ${id}  
  Request type:  ${taskType} ${taskSubType}
  Time spent:  ${taskTime.split(":").splice(1).join(":")}
  Причина: ${reasonOfCanceletionArr[reasonIndex]}
     `.trim())
          .then(() => {
               document.querySelector(".modal-resons").style.opacity = 0;
          })
          .catch(() => alert("Error"))
          .finally(() => {
               setTimeout(() => {
                    document.querySelector(".modal-resons").remove();
               }, 1000);
          });
}
function handleTriggerClick(e) {
     e.stopPropagation();
     e.preventDefault();

     const modal = document.createElement("div");
     modal.classList.add("modal-resons");

     modal.style.cssText = `
          width: 500px;
          position: absolute;
          z-index: 200;
          left: 50%;
          top: 300px;
          transform: translateX(-50%);
          border-radius: 20px;
          transition: all 1s ease;
          box-shadow: 2px 3px 12px 2px grey;
     `;

     const listItemsArr = reasonOfCanceletionArr.map((reason, i) => {
          return `<li style="list-style: none;">
               <label style="cursor: pointer">
                    <input style="cursor: pointer" type="radio" name="reason" data-position=${i} />
                    ${i + 1}) ${reason}
               </label>
          </li>`
     })

     modal.innerHTML = `
          <h6 style="text-align: center; font-size: 16px; margin: 0; padding: 10px; background: #343c49; color: #FFF; border-radius: 20px 20px 0 0;">Перелік причин</h6>
          <ul style="padding: 15px 10px; background: #FFF;">
             ${listItemsArr.toString().replace(/,/ig, "")}
          </ul>
     `;

     modal.querySelectorAll(`input[name]`).forEach(input => {
          input.addEventListener("change", (event) => {
               if (event.target.checked) {
                    pastTextToclipboard(event.target.dataset.position, e)
               }
          });
     });

     document.body.append(modal);
}
function startAsyasynchronouslyScript() {
     setTimeout(() => setCopyIcon(), 1000);
}
function handleClickOnTarget(e) {
     if (e.target.closest("span.ng-star-inserted")) {
          const textWrapper = e.target.closest("span.ng-star-inserted");

          if (textWrapper.textContent === "TrackEnsure ELD") {
               return;
          }

          navigator.clipboard.writeText(textWrapper.textContent?.trim().replace(/\(\w+\)/ig, ""));
          textWrapper.style.cssText = `
               color: green;
               font-size: 16px;
               white-space: nowrap;
               transition: all .2s ease-in;
          `;

          const idTimeout = setTimeout(() => {
               textWrapper.style.cssText = "";
               clearTimeout(idTimeout);
          }, 500);
     }
}

//=========Time running out=======================================================================================

function mountTimeCopyTrigger() {
     const tasksRows = document.querySelectorAll("div.datatable-row-center.datatable-row-group.ng-star-inserted");

     let timeTrigger;

     tasksRows.forEach((item) => {

          item.querySelectorAll(".datatable-body-cell-label").forEach((item, i) => { //селектор типа таска

               if (i !== 9) return;

               const typeOfTask = item.querySelector("span").textContent.toLocaleLowerCase();

               if (typeOfTask && typeOfTask === "time is running out") {

                    timeTrigger = document.createElement("div");
                    timeTrigger.classList.add("timeTriggerButton");

                    timeTrigger.innerHTML = `📧`;


                    timeTrigger.style.cssText = `
                              display: inline-block;
                              cursor: pointer;
                              font-size: 28px;
                              text-align: center;
                         `;

                    if (item.querySelector(".timeTriggerButton")) {
                         return;
                    };

                    item.append(timeTrigger);
               }
          });
     });

     try {
          document.querySelectorAll(".timeTriggerButton").forEach(trigger => {
               trigger.addEventListener("click", handleClickOnEnvelop);
          });
     } catch (error) {
          console.log(error);
     }
}

function handleClickOnEnvelop(e) {
     e.stopPropagation();
     const parentElement = e.target.closest("div.datatable-row-center.datatable-row-group.ng-star-inserted");
     const target = e.target;

     target.style.cssText = `
          font-size: 18px;
          transition: 1s all ease-in;
     `;

     const taskData = {
          driverName: parentElement.querySelectorAll("div.datatable-body-cell-label > div.ng-tns-c5-1 > span.ng-star-inserted")[1].textContent,
          taskType: parentElement.querySelectorAll("div.datatable-body-cell-label > div.ng-star-inserted > div.ng-tns-c5-1 > span.ng-tns-c5-1")[0].textContent,
     };

     const { driverName } = taskData;

     const handleKeyPress = (e) => {
          e.preventDefault();
          document.removeEventListener("keypress", handleKeyPress);

          const condition = e.code === "Digit1";

          let textForEmail = condition ? "you" : `your driver ${driverName.replace(/\(\w+\)/ig, "")}`

          navigator.clipboard.writeText(`TrackEnsure: The time of the subscription is running out

Dear customer,

We want to inform you that the time of monthly subscription for ${textForEmail} is running out. 

Be advised that ${condition ? "you" : "your driver"} can still contact our department regarding the technical issues that might happen. Overusing the subscription implies an extra bill for every extra minute. When your payment cycle renews, you will receive an extra bill for the previous month to the email, mentioned in your profile.

Please, make sure that your email is correct to get all the information in time.

If you would like more information or have any questions on any of our products, please do not hesitate to get in touch with us by dialing +1 888-995-7850 ex. 4; +1(916)800-0111 ex. 4 (West Coast); +1(866)773-4450 ex. 4 (US-866).

Have a good day!

Looking forward to hearing  from you,
Sales Agent Evgeny
               `.trim())
               .then(() => {
                    target.style.fontSize = "25px";
               })
               .catch(() => alert("Error"))
               .finally(() => {
                    setTimeout(() => {
                         target.style.opacity = "0.3";
                    }, 1000);
               });
     }

     document.addEventListener("keypress", handleKeyPress);
}