const algorithm = ({

  luhnCheck: function (intStr) {

    if (!intStr || !String(intStr).match(/^\d+$/)) 
      return "X";
    
    var b = String(intStr).split("");

    b = b.reverse();

    var X = 0;
    var sD = 0;
    var xL = [
      0,
      2,
      4,
      6,
      8,
      1,
      3,
      5,
      7,
      9
    ];
    var lD = 0;

    for (X = 0; X < b.length; X++) {

      if (X % 2 === 0) {

        sD += xL[b[X].charCodeAt(0) - 48];

      } else {

        sD += (b[X].charCodeAt(0) - 48);

      }

    }

    lD = 10 - (sD % 10);

    if (lD === 10) {

      lD = 0;

    }

    return String(lD);

  },

  Bas2Bas: function (Number, FromBase = 10, ToBase = 30) {

    if (!FromBase) 
      FromBase = 10;
    
    if (!ToBase) 
      ToBase = 30;
    
    if (!Number) 
      return;
    
    var BaseDigits = "0123456789ABCDEFGHJKLMNPRTVWXY";
    var MyResult = "";
    var dRemainder = 0;
    var MyPlace = 0;
    var MyDigit = 0;
    var dValue = 0;

    Number = String(Number)
      .toUpperCase()
      .trim();

    var done = false;

    for (MyPlace = 0; MyPlace < Number.length; MyPlace++) {

      for (MyDigit = 0; MyDigit < 30; MyDigit++) {

        if (MyDigit >= FromBase) {
          done = true;
          break;
        }

        var lh = BaseDigits.substring(MyDigit, MyDigit + 1);
        var rh = Number.substring(MyPlace, MyPlace + 1);

        if (lh === rh) 
          break;

        }
      
      if (done) 
        break;
      
      dValue += (MyDigit * Math.pow(FromBase, (Number.length - MyPlace - 1)));

    }

    while (dValue > 0) {

      dRemainder = dValue - (ToBase * parseInt(dValue / ToBase, 10));
      MyResult = BaseDigits.substring(dRemainder, dRemainder + 1) + MyResult;
      dValue = parseInt(dValue / ToBase, 10);

    }

    return MyResult;

  },

  AuthKey: function (RecID) {

    var AuthID;
    var Luhn;

    if (String(RecID).match(/^\d+$/)) {

      AuthID = parseInt(RecID, 10) + 10000;

      Luhn = algorithm.luhnCheck(AuthID);

      return algorithm.Bas2Bas(Luhn + AuthID);

    } else {

      return "";

    }

  },

  bas2num: function (token, FromBase, ToBase) {

    if (!FromBase) 
      FromBase = 10;
    
    if (!ToBase) 
      ToBase = 30;
    
    if (!token) 
      return;
    
    var BaseDigits = "0123456789ABCDEFGHJKLMNPRTVWXY";
    var dValue = 0;

    token = String(token)
      .toUpperCase()
      .trim()
      .split("")
      .reverse();

    for (var i = 0; i < token.length; i++) {

      var index = BaseDigits.indexOf(token[i]);

      dValue += (index * Math.pow(ToBase, i));

    }

    return dValue;

  },

  decode: function (token) {

    var result = false;

    var num = algorithm.bas2num(token);

    var originalLuhn = (String(num).length <= String(10000).length
      ? 0
      : String(num).substring(0, 1));

    var AuthID = (String(num).length <= String(10000).length
      ? String(num)
      : String(num).substring(1));

    var Luhn = algorithm.luhnCheck(AuthID);

    // eslint-disable-next-line
    var RecID = parseInt(AuthID, 10) - 10000;

    result = (parseInt(originalLuhn, 10) === parseInt(Luhn, 10));

    return result;

  }

})

export default algorithm;