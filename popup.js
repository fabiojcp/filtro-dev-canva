const createNewElement = (devsList) => {
  let filtersContainer = document.getElementById("filtersContainer");

  if (!filtersContainer) {
    filtersContainer = document.createElement("div");
    filtersContainer.id = "filtersContainer"
  } else if (filtersContainer) {
    filtersContainer.textContent = ""
  }


  for (let i = 0; i < devsList.length; i++) {
    const devsObj = devsList[i];

    Object.keys(devsObj).forEach((key) => {
      const filter = document.createElement("div");
      filter.style.display = "flex";
      filter.style.justifyContent = "space-between";

      const delFilterBtn = document.createElement("button");
      delFilterBtn.textContent = "delete";
      delFilterBtn.classList = [key, "delFilterBtn"];
      delFilterBtn.style.width = "fit-content";
      delFilterBtn.style.height = "fit-content";
      delFilterBtn.style.alignSelf = "center";

      const filterBtn = document.createElement("button");
      filterBtn.textContent = "filtrar";
      filterBtn.classList = [key, "filterBtn"];
      filterBtn.style.width = "fit-content";
      filterBtn.style.height = "fit-content";
      filterBtn.style.alignSelf = "center";

      const p = document.createElement("p");
      p.textContent = key;
      p.style.height = "15px";
      p.style.textOverflow = "ellipsis";
      p.style.overflow = "hidden";
      p.style.whiteSpace = "nowrap";
      p.style.fontSize = "12px"

      filter.appendChild(p);
      filter.appendChild(filterBtn);
      filter.appendChild(delFilterBtn);
      filtersContainer.appendChild(filter);
    })
  }

  document.body.appendChild(filtersContainer);
}

chrome.storage.onChanged.addListener((changes, _) => {
  if (Object.keys(changes).includes("devs")) {
    chrome.storage.sync.get("devs", ({ devs }) => {
      if (devs) {
        createNewElement(devs);
      }
    });
  }
});


const localStorage = chrome.storage.sync.get("devs", ({ devs }) => {
  if (devs) {
    createNewElement(devs);
  };
});


document.addEventListener('DOMContentLoaded', () => {
  let checkPageButton = document.getElementById('btn');
  checkPageButton.addEventListener('click', () => {
    let devsNames = document.getElementById("devsNames");
    let setName = document.getElementById("setName");
    chrome.storage.sync.get("devs", ({ devs }) => {
      const devsList = typeof devs === "object" ? devs : [];

      if (!devsNames.value.trim() | setName.value) {
        return ""
      }

      const objectSave = {};
      objectSave[setName.value] = devsNames.value.trim();
      devsList.push(objectSave);

      chrome.storage.sync.set({ "devs": devsList });

      devsNames.value = "";
      setName.value = "";
    });

  }, false);
}, false);


document.addEventListener("DOMContentLoaded", () => {
  document.addEventListener('click', (event) => {
    const clsList = event.target.className.split(",")

    const setName = clsList[0]
    const delOrFil = clsList[1]

    chrome.storage.sync.get(null, (storageItems) => {
      const devsList = storageItems.devs
      const filter = storageItems.filter || false

      const selectedSet = devsList?.filter(obj => {
        return Object.keys(obj).includes(setName)
      })[0]

      console.log(storageItems);

      switch (delOrFil) {
        case "delFilterBtn":
          chrome.storage.sync.get("devs", ({ devs }) => {
            devs.map((obj) => {
              if (Object.keys(obj).includes(setName)) {
                const filterIndex = devs.findIndex((dev) => obj === dev);
                devs.splice(filterIndex, 1)
                chrome.storage.sync.set({ "devs": devs })
              }
            })

          })
          break;

        default:
          if (selectedSet && !filter.bool) {
            chrome.storage.sync.set({ "filter": { "set": Object.values(selectedSet)[0].split(", "), "bool": true } })
          } else if (selectedSet && filter.bool) {
            chrome.storage.sync.set({ "filter": { "set": Object.values(selectedSet)[0].split(", "), "bool": false } })
          }
          break;
      };
    })
  }, false)
}, false)