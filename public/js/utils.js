const isNonEmptyArray = array => {
  return Array.isArray(array) && array.length > 0;
};

const toast = ({ message = "Something went wrong", status = false }) => {
  Toastify({
    text: message,
    duration: 3000,
    style: {
      background: status ? "#01b075" : "#EE4037",
    },
  }).showToast();
};

export { isNonEmptyArray, toast };
