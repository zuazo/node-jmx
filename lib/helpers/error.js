
function checkError(err, obj) {
  if (err) {
    console.error(err);
    if (typeof obj === "object") {
      obj.emit("error", err);
    } else {
      throw err;
    }
    return true;
  }
  return false;
}

module.exports = {
  checkError: checkError
}

