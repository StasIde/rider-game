const isNonEmptyArray = array => {
  return Array.isArray(array) && array.length > 0;
};

const toast = ({ message = "Something went wrong", status }) => {
  Toastify({
    text: message,
    duration: 3000,
    style: {
      background: status === "success" ? "green" : "red",
    },
  }).showToast();
};

export { isNonEmptyArray, toast };
