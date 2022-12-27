function setCopyIcon() {
     const tasksRows = document.querySelectorAll("div.datatable-row-center.datatable-row-group.ng-star-inserted");

     let copyTrigger;

     tasksRows.forEach((item) => {

          const extraType = item.querySelectorAll("div.datatable-body-cell-label > div.ng-star-inserted > div.ng-tns-c5-1 > span.ng-tns-c5-1")[1]?.textContent ?? "";

          switch (extraType.toLocaleLowerCase().slice(1, extraType.length - 1)) {
               case "one time help":
                    return;
          }

          item.querySelectorAll(".datatable-body-cell-label").forEach(item => {
               item.querySelectorAll("span.ng-tns-c5-1").forEach(item => {

                    if (item.textContent.length > 1 && item.textContent === "LOG EDITING") {
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
          console.log(error)
     }
}

function handleTriggerClick(e) {
     e.stopPropagation();
     e.preventDefault();

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
  Причина:
     
     `.trim())
          .then(() => {
               parentElement.style.cssText = `
                    transform: scale(0.95);
                    transition: all 0.3s ease 0s;
               `;
          })
          .catch(() => alert("Error"))
          .finally(() => {
               setTimeout(() => {
                    parentElement.style.cssText = ``;
               }, 1000);
          });
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

          navigator.clipboard.writeText(textWrapper.textContent?.trim());
          textWrapper.style.cssText = `
               color: green;
               font-size: 16px;
               transition: color .5s ease-in;
          `;

          const idTimeout = setTimeout(() => {
               textWrapper.style.cssText = "";
               clearTimeout(idTimeout);
          }, 500);
     }
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {

     if (request.requestOwm === 'run') {

          document.addEventListener("click", handleClickOnTarget);

          setTimeout(() => {
               setCopyIcon();

               document.querySelector(".row.row-cols-xl-2 .btn-primary").addEventListener("click", startAsyasynchronouslyScript);

               document.querySelector(".datatable-body").addEventListener("scroll", setCopyIcon);

          }, 1000);
     } else {
          try {
               document.querySelectorAll(".copyTriggerButton").forEach(item => item.remove());

               document.querySelector(".row.row-cols-xl-2 .btn-primary").removeEventListener("click", startAsyasynchronouslyScript);

               document.querySelector(".datatable-body").removeEventListener("scroll", setCopyIcon);

               document.removeEventListener("click", handleClickOnTarget);
          } catch (error) {
          }
     }
});
