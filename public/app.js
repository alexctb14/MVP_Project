let mainContainer = document.querySelector(".main_container");
let listContainer = document.querySelector(".bucket_list");
let createButtonDiv = document.querySelector(".create_button");

//CREATE (POST REQUEST) BUTTON
let textDisplay = document.createElement("span");

let deleteButton = document.createElement("button");
deleteButton.textContent = "Delete";

let inputField = document.createElement("input");
inputField.type = "text";

let editButton = document.createElement("button");
editButton.textContent = "Edit";

let createButton = document.createElement("button");
createButton.textContent = 'Create';
createButton.addEventListener('click', () => {
  let createdActivity = inputField.value;
  console.log(createdActivity)  
  fetch(`/api/list`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ activity: createdActivity })
  })
    .then((res) => res.json())
    .then((createdItem) => {
      let itemDiv = document.createElement('div');
      let bold = document.createElement("b");
      textDisplay.textContent = createdItem.activity;
      bold.textContent = "Please refresh to edit/delete newly created items"

      itemDiv.append(textDisplay);
      itemDiv.append(editButton);
      itemDiv.append(deleteButton);
      itemDiv.append(bold);
      listContainer.append(itemDiv);
    
    })
    .catch((error) => {
      console.error("Error updating data:", error);
  });
});

createButtonDiv.append(inputField);
createButtonDiv.appendChild(createButton)

fetch("/api/list")
  .then((res) => res.json())
  .then((bucketList) => {
    console.log(bucketList)
    let count = 0;
    for (let item of bucketList) {
      let itemDiv = document.createElement("div");

      // Text content display
      let textDisplay = document.createElement("span");
      textDisplay.textContent = item.activity;
      itemDiv.appendChild(textDisplay);

      // Input field for editing
      let inputField = document.createElement("input");
      inputField.type = "text";

      //EDIT(PATCH REQUEST) BUTTON
      let editButton = document.createElement("button");
      editButton.textContent = "Edit";
      let arrayValue = bucketList[count].id;
      editButton.addEventListener("click", () => {
        let updatedActivity = inputField.value;
        console.log("Updated activity:", updatedActivity);
        fetch(`/api/list/${arrayValue}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ activity: updatedActivity })
        })
          .then((res) => res.json())
          .then((updatedItem) => {
            // Update the text content in the UI
            textDisplay.textContent = updatedItem.activity;
          })
          .catch((error) => {
            console.error("Error updating data:", error);
          });
        });
      //DELETE (DELETE REQUEST) BUTTON
      let deleteButton = document.createElement("button");
      deleteButton.textContent = "Delete";
      deleteButton.addEventListener("click", () => {
        fetch(`/api/list/${arrayValue}`, {
          method: "DELETE"
        })
        .then((res) => {
          console.log("Delete Successful:", res);
          itemDiv.remove();
        })
      });

      itemDiv.append(inputField);
      itemDiv.append(editButton);
      itemDiv.append(deleteButton);
      listContainer.append(itemDiv);
      count++
    };
  })
  .catch((error) => {
    console.error("Error fetching data:", error);
  });

