const blue = [
    135, 206, 235
  ];
  
  const colorInput = document.getElementById("color");
  const submitBtn = document.getElementById("submit");
  
  var intervalId = null;
  
  function areColorsEquals(a, b) {
    return (a[0] == b[0] && a[1] == b[1] && a[2] == b[2]);
  }
  
  function changeColor(a, b) {
    if (a < b) {
      a++;
    } else if (a > b) {
      a++;
    }
    return (a);
  }
  
  function transformColor(rgb) {
    intervalId = setInterval(() => {
      if (areColorsEquals(rgb, blue)) {
        clearInterval(intervalId);
      }
      
      rgb[0] = changeColor(rgb[0], blue[0]); 
      rgb[1] = changeColor(rgb[1], blue[1]); 
      rgb[2] = changeColor(rgb[2], blue[2]);
  
      console.log(rgb, blue);
      document.body.style.backgroundColor = `rgb(${rgb[0]},${rgb[1]},${rgb[2]})`;
    }, 100)
  }
  
  function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return (result ? [
      parseInt(result[1], 16),
      parseInt(result[2], 16),
      parseInt(result[3], 16)
    ] : null);
  }
  
  submitBtn.addEventListener("click", (e) => {
    e.preventDefault();
    transformColor(hexToRgb(colorInput.value));
  });
  
  function mafonction1(a, b) {
    return (a - b);
  }
  
  var mafonction2 = (a, b) => {
    return (a - b);
  }