// Budget Controller
var budgetController = (function() {

    // constructors
    var Expense = function(id, desc, value) {
        this.id = id;
        this.desc = desc;
        this.value = value;
    };

    var Income = function(id, desc, value) {
        this.id = id;
        this.desc = desc;
        this.value = value;
    };

    // empty arrays
    var income =[], expense = [];
    var totalExp = totalInc = 0;

    return {
        addItem: (type, desc, val) => {
            var newItem, ID;

            if(type === "plus") {
                if(income.length === 0) {
                    ID = 0;
                }
                else {
                    // last element + 1 as new id
                    ID = income[income.length - 1].id + 1;  // .id
                }
                newItem = new Income(ID, desc, val);
                income.push(newItem);
            }
            else if(type === "minus") {
                if(expense.length === 0) {
                    ID = 0;
                }
                else {
                    ID = expense[expense.length - 1].id + 1;
                }
                newItem = new Expense(ID, desc, val);
                expense.push(newItem);
            }
            // return the current item to update UI

            console.log(newItem);
            return newItem;
        }
    };

})();







// UI Controller
var UIController = (function() {

    // storing all the UI classes as object

    var DOMStrings = {
        inputType: ".add__type",
        inputDesc: ".add__description",
        inputValue: ".add__value",
        addBtn: ".add__btn",
        incomeContainer: ".income__list",
        expensesContainer: ".expenses__list"
    };

    return {

        // function to return the 3 input values
        getInput: () => {
            // return as 3 variables or as a single object
            return {
                type: document.querySelector(DOMStrings.inputType).value,
                description: document.querySelector(DOMStrings.inputDesc).value,
                value: document.querySelector(DOMStrings.inputValue).value
            };
        },

        // function to return dom strings
        getDOMStrings: () => {
            return DOMStrings;
        },

        // add to the UI
        addListItem: (obj, type) => {
            var html, updatedHTML, pos;

            console.log(type);
            
            // 1. create the description, amount, percentage in html   
            if(type === "plus") {
                pos = DOMStrings.incomeContainer;
                html = '<div class="item" id="income-%id%"><div class="right d-flex justify-content-between align-items-center"><span class="item__description">%description%</span><span class="item__value ml-auto">%value%</span><span class="item__delete"><button class="btn btn-link item__delete--btn d-none"><i class="ion-ios-close-outline"></i></button></span></div></div>';
            }
            else if(type === "minus") {
                pos = DOMStrings.expensesContainer;
                html = '<div class="item" id="expense-%id%"><div class="right d-flex justify-content-between align-items-center"><span class="item__description">%description%</span><span class="item__value ml-auto">%value%</span><span class="item__percentage">21%</span><span class="item__delete"><button class="btn btn-link item__delete--btn d-none"><i class="ion-ios-close-outline"></i></button></span></div></div>';                
            }

            console.log(obj.id);

            // 2. update with current values
            updatedHTML = html.replace("%id%", obj.id);
            updatedHTML = updatedHTML.replace("%description%", obj.desc);
            updatedHTML = updatedHTML.replace("%value%", obj.value);

            // 3. inject html code after the container
            // refer: https://developer.mozilla.org/en-US/docs/Web/API/Element/insertAdjacentHTML
            document.querySelector(pos).insertAdjacentHTML('beforeend', updatedHTML);

        } 
    };

})();







// GLOBAL APP CONTROLLER
var controller = (function(budgetCtrl, UICtrl) {

    var setupEventListeners = () => {
    
        var DOM = UICtrl.getDOMStrings();

        // click button
        document.querySelector(DOM.addBtn).addEventListener("click", ctrlAddItem);
    
        // or press enter
        document.addEventListener("keypress", (e) => {
            // e.which for older browsers
            if(e.keyCode === 13 || e.which === 13) {
                ctrlAddItem();
            }
        });
    };

    var ctrlAddItem = () => {
        var input, newItem;

        // 1. Get Data
        input = UICtrl.getInput();
        
        // 2. Add item to budget controller
        newItem = budgetCtrl.addItem(input.type, input.description, input.value);
        
        // 3. Add item to UI

        // console.log(newItem);

        console.log(newItem);

        UICtrl.addListItem(newItem, input.type);
        

        // 4. Calculate Budget

        // 5. Display budget on UI
    }
    
    return {
        init: () => {
            // console.log("Started!!");
            setupEventListeners();
        }
    }

        
})(budgetController, UIController);


controller.init();