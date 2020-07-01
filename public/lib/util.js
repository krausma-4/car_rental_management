/**
 * @fileOverview  Defines utility procedures/functions   
 * @author Gerd Wagner
 */
const util = {
 /**
  * Verifies if a value represents an integer
  * @param {string} x
  * @return {boolean}
  */
  isNonEmptyString: function (x) {
    return typeof(x) === "string" && x.trim() !== "";
  },
 /**
  * Return the next year value (e.g. if now is 2013 the function will return 2014)
  * @return {number}  the integer representing the next year value
  */
  nextYear: function () {
   const date = new Date();
   return (date.getFullYear() + 1);
  }, 
 /**
  * Verifies if a value represents an integer or integer string
  * @param {string} x
  * @return {boolean}
  */
  isIntegerOrIntegerString: function (x) {
    return typeof(x) === "number" && x.toString().search(/^-?[0-9]+$/) === 0 ||
        typeof(x) === "string" && x.search(/^-?[0-9]+$/) === 0;
  },
 /**
  * Creates a typed "data clone" of an object
  * @param {object} obj
  */
  cloneObject: function (obj) {
   const clone = Object.create(Object.getPrototypeOf(obj));
   for (let p in obj) {
      if (obj.hasOwnProperty(p) && typeof obj[p] !== "object") {
        clone[p] = obj[p];
      }
    }
    return clone;
  },
  /* Create option elements from a map of objects
   * and insert them into a selection list element
   *
   * @param {object} objColl  A collection (list or map) of objects
   * @param {object} selEl  A select(ion list) element
   * @param {string} stdIdProp  The standard identifier property
   * @param {string} displayProp [optional]  A property supplying the text 
   *                 to be displayed for each object
   */
  fillSelectWithOptions: function (objColl, selEl, stdIdProp, displayProp) {
    if (Array.isArray( objColl)) {
      for (let obj of objColl) {
        const optionEl = document.createElement("option");
        optionEl.value = obj[stdIdProp];
        optionEl.text = displayProp ? obj[displayProp] : obj[stdIdProp];
        selEl.add( optionEl, null)
      }
    } else {
      for (let key of Object.keys( objColl)) {
        const obj = objColl[key];
        const optionEl = document.createElement("option");
        optionEl.value = obj[stdIdProp];
        optionEl.text = displayProp ? obj[displayProp] : obj[stdIdProp];
        selEl.add( optionEl, null)
      }
    }
  },
};