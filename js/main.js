/* PRO STUFF:
Model:
  - property for admin view showing (true/false)
View:
  - add event listeners for form buttons
Octopus:
  - func to open the view on Admin
  - func to close the view on Cancel
  - func to update current cat on Save

Form:
  - name
  - img src
  - click count
*/

/* -- MODEL -- */
const model = {
  init: function(i=0) {
    if (!localStorage.cats) {
      const model = {
          currentCat: null,
          cats: [
            {
              id: 0,
              catName: "Cicaa",
              catImg: "images/cat1.jpg",
              clickCount: 0
            },
            {
              id: 1,
              catName: "Jajdecicaa",
              catImg: "images/cat2.jpg",
              clickCount: 0
            },
            {
              id: 2,
              catName: "Ciiic",
              catImg: "images/cat3.jpg",
              clickCount: 0
            },
            {
              id: 3,
              catName: "Juuuuuuj",
              catImg: "images/cat4.jpg",
              clickCount: 0
            },
            {
              id: 4,
              catName: "Awwww",
              catImg: "images/cat5.jpg",
              clickCount: 0
            }
          ]
        };
        model.currentCat = model.cats[i];
      localStorage.cats = JSON.stringify(model);
    }
  },

  getAllCats: function() {
    return JSON.parse(localStorage.cats).cats;
  },

  getCurrentCat: function() {
    return JSON.parse(localStorage.cats).currentCat;
  },

  // Change the currently-selected cat to the object passed in
  changeCurrentCat: function(cat) {
    const cats = JSON.parse(localStorage.cats);
    cats.currentCat = cat;
    localStorage.cats = JSON.stringify(cats);
  },

  // Increments the counter for the currently-selected cat
  incrementCount: function() {
    const cats = JSON.parse(localStorage.cats);
    const currentCat = cats.currentCat;
    currentCat.clickCount++;
    cats.cats[currentCat.id] = currentCat;
    localStorage.cats = JSON.stringify(cats);
  },

  updateCat: function(name, src, cnt) {
    const cats = JSON.parse(localStorage.cats);
    const currentCat = cats.currentCat;
    currentCat.catName = name;
    currentCat.catImg = src;
    currentCat.clickCount = cnt;
    cats.cats[currentCat.id] = currentCat;
    localStorage.cats = JSON.stringify(cats);
  },

  // Reset the counters and stay on currently-selected cat
  resetCats: function() {
    const i = this.getCurrentCat().id;
    localStorage.removeItem("cats");
    this.init(i);
  }
};

/* -- CONTROLLER -- */
const octopus = {
  init: function() {
    model.init();
    catListView.init();
    catView.init();
  },

  getCats: function() {
    return model.getAllCats();
  },

  // Change the currently-selected cat to the object passed in
  changeCat: function(i) {
    const cat = model.getAllCats()[i];
    model.changeCurrentCat(cat);
    catView.render();
  },

  // Increments the counter for the currently-selected cat
  catClick: function() {
    model.incrementCount();
    catView.render();
  },

  currentCat: function() {
    return model.getCurrentCat();
  },

  // Reset the counters and stay on currently-selected cat
  reset: function() {
    model.resetCats();
    catView.render();
  },

  toggleAdmin: function() {
    const form = document.getElementById("admin-form");
    const btn = document.getElementById("admin-button");
    form.classList.toggle("hidden");
    btn.classList.toggle("hidden");
  },

  updateCat: function(name, src, cnt) {
    model.updateCat(name, src, cnt);
    catView.render();
  }
}

/* -- VIEWS -- */
// Cat list
const catListView = {
  init: function() {
    // Store required DOM elements
    this.catList = document.getElementById("cat-list");
    this.render();
  },
  render: function() {
    const catList = this.catList;
    octopus.getCats().forEach(function(cat){
      const catName = cat.catName;
      const catClass = `cat-list-${cat.id}`;

      // Create new DOM element based on cat
      const elem = document.createElement("li");
      elem.textContent = catName;
      elem.className = `${catClass} cat-list-common`;
      catList.appendChild(elem);

      // On click, change the selected cat
      elem.addEventListener("click", (function(i) {
        return function() {
          octopus.changeCat(i);
        };
      })(cat.id));
    });
  }
}

// Cat view
const catView = {
  init: function() {
    // Store required DOM elements
    this.catName = document.getElementById("cat-name");
    this.catImg = document.getElementById("cat-img");
    this.catCounter = document.getElementById("cat-counter");
    // Admin form DOM elements
    const catAdminForm = document.getElementById("admin-form");
    const catAdminCancel = document.getElementById("admin-cancel");
    this.catAdminName = document.getElementById("admin-cat-name");
    this.catAdminSrc = document.getElementById("admin-cat-src");
    this.catAdminCnt = document.getElementById("admin-cat-count");

    // On submit, update the values and toggle hidden
    catAdminForm.addEventListener("submit", (e) => {
      octopus.updateCat(this.catAdminName.value, this.catAdminSrc.value, this.catAdminCnt.value);
      octopus.toggleAdmin();
      e.preventDefault();
    });

    // On cancel, reset values to original and toggle hidden
    catAdminCancel.addEventListener("click", () => {
      octopus.toggleAdmin();
      this.render();
    });

    // On click, increment the counter
    this.catImg.addEventListener("click", function() {octopus.catClick()}, false);
    this.render();
  },
  render: function() {
    // Update DOM elements with current cat
    const cat = octopus.currentCat();
    this.catName.textContent = cat.catName;
    this.catImg.src = cat.catImg;
    this.catCounter.textContent = cat.clickCount;
    this.catAdminName.value = cat.catName;
    this.catAdminSrc.value = cat.catImg;
    this.catAdminCnt.value = cat.clickCount;
  }
}

/* -- STARTER -- */
octopus.init();
