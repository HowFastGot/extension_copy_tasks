chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {

     if (request.requestOwm === 'run') {

          document.addEventListener("dblclick", handleClickOnTarget);

          setTimeout(() => {
               setCopyIcon();
               mountTimeCopyTrigger();

               document.querySelector(".row.row-cols-xl-2 .btn-primary").addEventListener("click", startAsyasynchronouslyScript);

               [setCopyIcon, mountTimeCopyTrigger, bindEventListenerToScroll].forEach(func => {
                    document.querySelector(".datatable-body").addEventListener("scroll", func);
               })


          }, 1000);
     } else {
          try {
               document.querySelectorAll(".copyTriggerButton").forEach(item => item.remove());
               document.querySelectorAll(".timeTriggerButton").forEach(item => item.remove());

               document.querySelector(".row.row-cols-xl-2 .btn-primary").removeEventListener("click", startAsyasynchronouslyScript);

               [setCopyIcon, mountTimeCopyTrigger, bindEventListenerToScroll].forEach(func => {
                    document.querySelector(".datatable-body").removeEventListener("scroll", func);
               })


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
     "Помощь требовалась другому водителю, суппорт по ошибке выбрал не того",
     "У водителя был технический вопрос, оказали консультацию при помощи mobile assistance",
     "Флит компании обратился только за консультацией"
]

function setCopyIcon() {

     const tasksRows = document.querySelectorAll("div.datatable-row-center.datatable-row-group.ng-star-inserted");
     let copyTrigger;

     if (tasksRows.length === 1 && document.querySelector(".copyTriggerButton")) return;

     tasksRows.forEach((item) => {

          const rowHorizontalSections = item.querySelectorAll(".datatable-body-cell");
          const taskType = rowHorizontalSections[9].querySelector("div.datatable-body-cell-label").textContent;
          const extraType = rowHorizontalSections[9].querySelector("div.datatable-body-cell-label > div > div:nth-child(9) > span")?.textContent;


          const provideELD = rowHorizontalSections[11].querySelector(".datatable-body-cell-label > .ng-tns-c6-1 > .ng-tns-c6-1")

          switch (provideELD.textContent.toLowerCase()) {
               case 'trackensure eld':
                    provideELD.style.fontStyle = "italic";
                    break;
               case "alfa eld":
                    provideELD.style.color = "red";
                    provideELD.style.fontSize = "16px";
                    provideELD.style.fontWight = "600";
                    break;
               case "vista eld":
                    provideELD.style.color = "blue";
                    provideELD.style.fontSize = "16px";
                    provideELD.style.fontWight = "600";
                    break;
               case "swift eld":
                    provideELD.style.color = "aqua";
                    provideELD.style.fontSize = "16px";
                    provideELD.style.fontWight = "600";
                    break;
               default:
                    provideELD.style.color = "rgb(255,0,255)";
                    provideELD.style.fontSize = "19px";
          }

          if (taskType.includes("LOG EDITING") && !taskType.includes("One Time")) {

               copyTrigger = document.createElement("div");
               copyTrigger.classList.add("copyTriggerButton");

               copyTrigger.innerHTML = `✏️`;


               copyTrigger.style.cssText = `
                         position: absolute;
                         right: 580px; 
                         top: 10px;
                         cursor: pointer;
                         font-size: 18px;
                         text-align: center;
                    `;

               if (item.querySelector(".copyTriggerButton")) {
                    return;
               }

               item.append(copyTrigger);
          }
     });

     try {
          document.querySelectorAll(".copyTriggerButton").forEach(trigger => {
               trigger.addEventListener("click", handleTriggerClick);
          });
     } catch (error) {
          console.log(error);
     }
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

function pastTextToclipboard(reasonIndex, e) {

     const collectionForTimeTask = e.target.parentElement.querySelectorAll(".datatable-body-cell");

     const taskData = {
          id: collectionForTimeTask[0].textContent,
          colleage: collectionForTimeTask[16].textContent.trim(),
          companyName: collectionForTimeTask[6].textContent.trim(),
          driverName: collectionForTimeTask[8].textContent.trim(),
          taskTime: collectionForTimeTask[15].textContent.slice(3),
          taskType: collectionForTimeTask[9].textContent.trim(),
          taskSubType: collectionForTimeTask[9].querySelector("div.datatable-body-cell-label > div > div:nth-child(9) > span")?.textContent ?? ""
     };

     const { id, colleage, companyName, driverName, taskTime, taskType, taskSubType } = taskData;

     navigator.clipboard.writeText(`  ) Суппорт ${colleage} просит отменить таск
  ${companyName.trim()} / ${driverName}
  Task ID: ${id}  
  Request type:  ${taskType} ${taskSubType}
  Time spent:  ${taskTime}
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

function startAsyasynchronouslyScript() {
     document.querySelectorAll(".copyTriggerButton").forEach(item => item.remove());
     document.querySelectorAll(".timeTriggerButton").forEach(item => item.remove());

     const timeIdCopyMark = setTimeout(() => {
          setCopyIcon();

          clearTimeout(timeIdCopyMark);
     }, 500);

     const timeId = setTimeout(() => {
          setCopyIcon();
          mountTimeCopyTrigger();
          createButton({
               actionButtonSelector: ".actions-button-width",
               completeButtonSelector: ".fa.fa-check.mr-2",
               modalBottomSelector: ".modal-content .modal-footer .no-gutters"
          })

          clearTimeout(timeId);
     }, 3000);
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
     const timeTriggerButtons = document.querySelectorAll(".timeTriggerButton");

     if (timeTriggerButtons.length > 0) {
          timeTriggerButtons.forEach(item => item.remove());
     }

     let timeTrigger;

     tasksRows.forEach((taskRow) => {

          const typeOfTask = taskRow.querySelectorAll(".datatable-body-cell")[9].querySelector("div.datatable-body-cell-label");
          const statusOfTask = taskRow.querySelector(".badge").textContent.toLocaleLowerCase().trim();

          if (typeOfTask && typeOfTask.textContent.toLocaleLowerCase() === "time is running out" && statusOfTask !== "completed") {

               typeOfTask.style.cssText = `
                    white-space: nowrap;
               `;

               timeTrigger = document.createElement("div");
               timeTrigger.classList.add("timeTriggerButton");

               timeTrigger.innerHTML = `📧`;


               timeTrigger.style.cssText = `
                              display: inline-block;
                              position: absolute;
                              right: 580px; 
                              top: 10px;
                              cursor: pointer;
                              font-size: 25px;
                              text-align: center;
                              transition: 1s all ease-in;
                         `;

               if (taskRow.querySelector(".timeTriggerButton")) {
                    return;
               };

               taskRow.append(timeTrigger);
          }

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

     const target = e.target;
     const collectionForTimeTask = target.closest("div.datatable-row-center.datatable-row-group.ng-star-inserted").querySelectorAll(".datatable-body-cell");

     const prevCssText = target.style.cssText;

     target.style.cssText = prevCssText + `
          font-size: 18px;
     `;

     const taskData = {
          driverName: collectionForTimeTask[8].textContent.trim(),
          taskType: collectionForTimeTask[9].textContent.trim(),
     };

     const { driverName } = taskData;

     const handleKeyPress = (e) => {
          e.preventDefault();
          document.removeEventListener("keypress", handleKeyPress);

          const condition = e.code === "Digit1";

          let textForEmail = condition ? "you " : `your driver ${driverName.replace(/\(\w+\)/ig, "")}`

          navigator.clipboard.writeText(`Dear customer,                             TrackEnsure: The time of the subscription is running out  

We want to inform you that the time of monthly subscription for ${textForEmail}is running out. 

Be advised that ${condition ? "you" : "your driver"} can still contact our department regarding the technical issues that might happen. Overusing the subscription implies an extra bill for every extra minute. When your payment cycle renews, you will receive an extra bill for the previous month to the email, mentioned in your profile.

Please, make sure that your email is correct to get all the information in time.

If you would like more information or have any questions on any of our products, please do not hesitate to get in touch with us by dialing +1 888-995-7850 ex. 4; +1(916)800-0111 ex. 4 (West Coast); +1(866)773-4450 ex. 4 (US-866).

Have a good day!

Looking forward to hearing  from you,
Sales Agent Evgeny
               `.trim())
               .then(() => {
                    target.style.cssText = prevCssText;
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

//=========Create the Save buttom=======================================================================================

function bindEventListenerToScroll() {
     createButton({
          actionButtonSelector: ".actions-button-width",
          completeButtonSelector: ".fa.fa-check.mr-2",
          modalBottomSelector: ".modal-content .modal-footer .no-gutters"
     })
}
function createButton(
     {
          actionButtonSelector,
          completeButtonSelector,
          modalBottomSelector
     }) {

     if (!document.querySelector("#showMyTasks input").checked) return;

     const tasksRows = document.querySelectorAll("div.datatable-row-center.datatable-row-group.ng-star-inserted");

     const handleClickOnPaidBtn = (e, typeOfTask) => {
          e.preventDefault();
          e.stopPropagation();
          const target = e.currentTarget;

          const textarea = document.querySelector("textarea");

          if (typeOfTask.includes('TIME IS RUNNING OUT')) {
               textarea.value = "Sent letter to the customer";
               const yesBtn = document.querySelector(".col-auto.right button");
               yesBtn.disabled = false;
               yesBtn.dispatchEvent(new MouseEvent("click", { bubbles: true }));
          } else {
               textarea.value = "The help has been paid";
               const arrowDown = document.querySelector(".col-auto.right .dropdown button");
               arrowDown.disabled = false;
               arrowDown.dispatchEvent(new MouseEvent("click", { bubbles: true }));

               setTimeout(() => {
                    document.querySelector(".right .dropdown-item").dispatchEvent(new MouseEvent("click", { bubbles: true }));
               }, 0)
          }



          target.removeEventListener("click", handleClickOnPaidBtn);
     }
     const handleClickOnCompleteBtn = (e, typeOfTask) => {
          e.preventDefault();
          e.stopPropagation();
          const target = e.target;

          setTimeout(() => {
               const modalBottom = document.querySelector(modalBottomSelector);

               if (modalBottom) {
                    const sentBtn = document.createElement("button");
                    sentBtn.textContent = "Done";
                    sentBtn.classList.add("btn");
                    sentBtn.classList.add("btn-primary");
                    sentBtn.style.color = "yellow";
                    document.querySelector(".col-auto.left").append(sentBtn);

                    sentBtn.addEventListener("click", (e) => handleClickOnPaidBtn(e, typeOfTask));


               }
          }, 500)
          target.removeEventListener("click", handleClickOnCompleteBtn);
     }

     const handleClickOnActionBtn = (e) => {
          e.preventDefault();
          e.stopPropagation();
          const target = e.target;

          target.removeAttribute("event-added");

          const parentRowTask = target.closest("div.datatable-row-center");
          const typeOfTask = parentRowTask.querySelectorAll(".datatable-body-cell")[9].querySelector("div.datatable-body-cell-label");
          const timeId = setTimeout(() => {
               const completeButtonsIcon = document.querySelectorAll(completeButtonSelector);

               completeButtonsIcon.forEach(btnIcons => {
                    const btn = btnIcons.closest("button");

                    if (!btn.getAttribute("event-added")) {
                         btn.style.fontStyle = "italic";
                         btn.style.color = "green";
                         btn.addEventListener("click", (e) => handleClickOnCompleteBtn(e, typeOfTask.textContent));
                         btn.setAttribute("event-added", true)
                    }

               })

               clearTimeout(timeId);
          }, 100)

          target.removeEventListener("click", handleClickOnActionBtn);
     }


     tasksRows.forEach(taskRow => {
          const badgeStatus = taskRow.querySelectorAll(".datatable-body-cell")[10].querySelector("div.datatable-body-cell-label").querySelector(".badge").textContent.trim().toLocaleLowerCase()

          if (badgeStatus === 'completed') return;

          const actionButton = taskRow.querySelector(actionButtonSelector);

          if (!actionButton.getAttribute("event-added")) {
               actionButton.addEventListener("click", handleClickOnActionBtn);
               actionButton.setAttribute("event-added", true)
          }
     })
}
