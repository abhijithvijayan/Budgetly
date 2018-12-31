/*
Refer: 
    https://blog.garstasio.com/you-dont-need-jquery/
    https://developer.mozilla.org/en-US/docs/Web/API/Element/insertAdjacentHTML
*/

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

    var i, budget = 0, totalIncome, totalExpense, percentage = -1;

    // calculate total sum
    var calculateTotal = (type) => {
       
        if (type === "plus") { 
            totalIncome = 0;
            for(i = 0; i < income.length; ++i) {
                totalIncome += income[i].value;
            }
        }
        else if (type === "minus") { 
            totalExpense = 0;
            for(i = 0; i < expense.length; ++i) {
                totalExpense += expense[i].value;
            }
        }
        
        // console.log("inc" + totalIncome);
        // console.log("exp" + totalExpense);
    };

    // empty arrays
    var income = [], expense = [];

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

            // console.log(newItem);
            return newItem;
        },

        deleteItem: (type, id) => {

            var newIDarray, pos;

            // create a new array with id's from the constructor
            if(type === "income") {

                // map traverses through the array and returns an array with all the elements
                newIDarray = income.map(function(current) {
                    return current.id;
                });
                // console.log(newIDarray);

                //find index of the element from this array and then delete from original array
                console.log(id);
                pos = newIDarray.indexOf(id); // returns -1 if element is not present
                if(pos !== -1) {
                    // delete from original array
                    income.splice(pos, 1);  // splice(index, no_of_elements_to_be_deleted)
                }
                console.log(income);

            }
            else if (type === "expense") {
                
                newIDarray = expense.map(function(current) {
                    return current.id;
                });
                // console.log(newIDarray);

                pos = newIDarray.indexOf(id);
                if(pos !== -1) {
                    expense.splice(pos, 1);
                }
            }

        },

        calculateBudget: () => {

            // 1. calculate total income and expense
            calculateTotal("plus");
            calculateTotal("minus");

            // 2. calculate budget : income - expense
            budget = totalIncome - totalExpense;
            // console.log(budget);

            // 3. calculate percentage of income spent
            if (totalIncome > 0) {
                percentage = Math.round((totalExpense / totalIncome) * 100);
            } else {
                percentage = -1;
            }
            // console.log(percentage);
            
        },

        getBudget: () => {
            return {
                budget: budget,
                totalIncome: totalIncome,
                totalExpense: totalExpense,
                percentage: percentage
            };
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
        expensesContainer: ".expenses__list",
        budgetValue: ".budget__value",
        budgetIncVal: ".budget__income--value",
        budgetExpVal: ".budget__expenses--value",
        expPercent: ".budget__expenses--percentage",
        delegation__element: ".delegation__element",
        month: ".budget__title--month"
    };

    // PRIVATE
    var formatNumber = (number, type) => {
        // + or -
        // decimal points to 2 places
        // comma separating thousands
        // 2305.3456 -> + 2,305.34

        var integer, decimal, numSplit, sign;

        number = Math.abs(number);
        number = number.toFixed(2); //outputs as a string
        numSplit = number.split('.');
        integer = numSplit[0];
        decimal = numSplit[1];
        if(integer.length > 3) {
            // 2310 -> 2,310 substr(pos, how many no's)
            integer = integer.substr(0, integer.length  - 3) + "," + integer.substr(integer.length - 3, 3); // 23540 -> 23,540
        }

        type === "plus" ? sign = '+' : sign = '-';
        // + 2,310.00
        return sign + " " + integer + "." + decimal;
    };

    // PUBLIC
    return {

        // function to return the 3 input values
        getInput: () => {
            // return as 3 variables or as a single object
            return {
                type: document.querySelector(DOMStrings.inputType).value,
                description: document.querySelector(DOMStrings.inputDesc).value,
                // to a decimal number
                value: parseFloat(document.querySelector(DOMStrings.inputValue).value)
            };
        },

        // add to the UI
        addListItem: (obj, type) => {
            var html, updatedHTML, pos;
            
            // 1. create the description, amount, percentage in html   
            if(type === "plus") {
                pos = DOMStrings.incomeContainer;
                html = '<div class="item" id="income-%id%"><div class="right d-flex justify-content-between align-items-center"><span class="item__description">%description%</span><span class="item__value ml-auto">%value%</span><span class="item__delete"><button type="button" class="btn btn-link item__delete--btn d-none"><i class="ion-ios-close-outline"></i></button></span></div></div>';
            }
            else if(type === "minus") {
                pos = DOMStrings.expensesContainer;
                html = '<div class="item" id="expense-%id%"><div class="right d-flex justify-content-between align-items-center"><span class="item__description">%description%</span><span class="item__value ml-auto">%value%</span><span class="item__delete"><button type="button" class="btn btn-link item__delete--btn d-none"><i class="ion-ios-close-outline"></i></button></span></div></div>';                
            }

            // 2. update with current values
            updatedHTML = html.replace("%id%", obj.id);
            updatedHTML = updatedHTML.replace("%description%", obj.desc);
            updatedHTML = updatedHTML.replace("%value%", formatNumber(obj.value, type));

            // 3. inject html code after the container
            document.querySelector(pos).insertAdjacentHTML('beforeend', updatedHTML);

        },

        deleteListItem: (elementID) => {

            var el = document.getElementById(elementID);
            // select the elements's parent id and then delete child
            el.parentNode.removeChild(el);
        },
        
        clearFields: () => {

            var fields, fieldsArray, i;

            // separate with comma
            fields = document.querySelectorAll(DOMStrings.inputDesc + ", " + DOMStrings.inputValue);
            // querySelectorAll -> returns a list
            // console.log(fields); 
            // convert to array using slice()
            fieldsArray = Array.prototype.slice.call(fields);

            for (i = 0; i < fieldsArray.length; ++i) {
                fieldsArray[i].value = "";
            }

            // or use for each            
            // fieldsArray.forEach((current, index, array) => {
            //     current.value = "";
            // });
        },

        displayBudget: (obj) => {
            var type;
            obj.budget > 0 ? type = "plus" : type = "minus";

            // update UI elements
            document.querySelector(DOMStrings.budgetValue).textContent = formatNumber(obj.budget, type);
            document.querySelector(DOMStrings.budgetIncVal).textContent = formatNumber(obj.totalIncome, "plus");
            document.querySelector(DOMStrings.budgetExpVal).textContent = formatNumber(obj.totalExpense, "minus");
            if(obj.percentage <= 0) {
                document.querySelector(DOMStrings.expPercent).textContent = "---";
            } else {
                document.querySelector(DOMStrings.expPercent).textContent = obj.percentage + "%";
            }
 
        },
        
        // function to return dom strings
        getDOMStrings: () => {
            return DOMStrings;
        },

        displayMonth: () => {
            var current, year, month, months;
            // date object contructor
            current = new Date();
            // zero based dec-> 11  
            months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            year = current.getFullYear();
            month = current.getMonth();
            document.querySelector(DOMStrings.month).textContent = months[month] + " " + year;
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

        // event delegation -> triggering an event on child element -> effect taken from parent element (bubbling)
        document.querySelector(DOM.delegation__element).addEventListener("click", ctrlDeleteItem);
    };

    var updateBudget = () => {
        // 1. calculate budget
        budgetCtrl.calculateBudget();

        // 2. return the budget(as object)
        var budget = budgetCtrl.getBudget();
        // console.log(budget);

        // 3. Display budget on UI
        UICtrl.displayBudget(budget);
    };

    var ctrlAddItem = () => {
        var input, newItem;

        // 1. Get Data
        input = UICtrl.getInput();

        // isNan returns true if no. is NaN
        if(input.description != "" && !isNaN(input.value) && input.value > 0) {
        
            // 2. if not null, Add item to budget controller
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);
            
            // 3. Add item to UI
            UICtrl.addListItem(newItem, input.type);

            // 4. Clear inputs 
            UICtrl.clearFields();

            // 5. Calculate Budget
            updateBudget();
        }
    };

    var ctrlDeleteItem = (e) => {
        var eventID, splitID, type, id, budgetData;

        // see where the event is triggered
        // console.log(e.target);
        // find the parent node(traversing)
        // console.log(e.target.parentNode.parentNode.parentNode);
        // find node's id
        // console.log(e.target.parentNode.parentNode.parentNode.id);

        eventID = e.target.parentNode.parentNode.parentNode.parentNode.id;
        if(eventID) {
            // returns array of elements that separated by '-'
            splitID = eventID.split('-');
            // console.log(splitID);
            type = splitID[0];
            // id = splitID[1];
            // console.log(typeof(id));  //string
            id = parseInt(splitID[1]);

            // 1. delete item from data structure
            budgetCtrl.deleteItem(type, id); 

            // 2. Delete item from UI
            UICtrl.deleteListItem(eventID);

            // 3. update and show new budget
            updateBudget();

        }

    };
    
    return {
        init: () => {
            // console.log("Started!!");
            setupEventListeners();
            // reset data with empty object pass
            UICtrl.displayBudget({
                budget: 0,
                totalIncome: 0,
                totalExpense: 0,
                percentage: 0
            });

            UICtrl.displayMonth();
        }
    }

        
})(budgetController, UIController);


controller.init();