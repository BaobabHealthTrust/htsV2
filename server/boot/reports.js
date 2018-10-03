module.exports = function (app) {

  let router = app
    .loopback
    .Router();

  const async = require("async");
  const fs = require("fs");
  const client = require("node-rest-client").Client;
  const es = require(__dirname + "/../../configs/elasticsearch.json");
  const site = require(__dirname + "/../../client-src/src/config/site.json");
  const locations = require(__dirname + '/../../client-src/src/config/pepfarLocations');
  const htsModalities = require(__dirname + '/../../client-src/src/config/htsModalities');

  const esClient = new require('elasticsearch').Client();

  let url = require("url");

  const debug = (msg) => {

    if (String(process.env.DEBUG_APP) === 'true') {
      console.log(msg);
    }

  }

  const padZeros = (number, positions) => {
    const zeros = parseInt(positions) - String(number).length;
    let padded = "";

    for (let i = 0; i < zeros; i++) {
      padded += "0";
    }

    padded += String(number);

    return padded;
  };

  if (Object.getOwnPropertyNames(Date.prototype).indexOf("format") < 0) {
    // eslint-disable-next-line
    Object.defineProperty(Date.prototype, "format", {
      value: function (format) {
        var date = this;

        var result = "";

        if (!format) {
          format = "";
        }

        var months = [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec"
        ];

        if (format.match(/YYYY-mm-dd\sHH:MM:SS/)) {
          result = date.getFullYear() + "-" + padZeros(parseInt(date.getMonth()) + 1, 2) + "-" + padZeros(date.getDate(), 2) + " " + padZeros(date.getHours(), 2) + ":" + padZeros(date.getMinutes(), 2) + ":" + padZeros(date.getSeconds(), 2);
        } else if (format.match(/YYYY-mm-dd/)) {
          result = date.getFullYear() + "-" + padZeros(parseInt(date.getMonth()) + 1, 2) + "-" + padZeros(date.getDate(), 2);
        } else if (format.match(/mmm\/d\/YYYY/)) {
          result = months[parseInt(date.getMonth())] + "/" + date.getDate() + "/" + date.getFullYear();
        } else if (format.match(/d\smmmm,\sYYYY/)) {
          result = date.getDate() + " " + monthNames[parseInt(date.getMonth())] + ", " + date.getFullYear();
        } else if (format.match(/d\smmm\sYYYY/)) {

          result = date.getDate() + " " + months[parseInt(date.getMonth(), 10)] + " " + date.getFullYear();

        } else {
          result = date.getDate() + "/" + months[parseInt(date.getMonth())] + "/" + date.getFullYear();
        }

        return result;
      }
    });
  }

  function fetchFNP(field, sMonth, sYear, eMonth, eYear, location, res, sDate, eDate) {

    debug(sMonth);
    debug(eMonth);
    debug(eYear);
    debug(parseInt(eMonth, 10) + 1);
    debug((new Date(eYear, (!isNaN(eDate) ? Number(eMonth) : (parseInt(eMonth, 10) + 1)), (!isNaN(eDate) ? eDate : 0))).format('YYYY-mm-dd'));

    let args = {
      data: {
        query: {
          bool: {
            must: [
              {
                query_string: {
                  query: 'observation:"Sex/Pregnancy" AND observationValue:"' + field + '" AND locationType:"' + location + '"'
                }
              }, {
                range: {
                  visitDate: {
                    gte: (new Date(sYear, sMonth, (!isNaN(sDate) ? Number(sDate) : 1))).format('YYYY-mm-dd'),
                    lte: (new Date(eYear, (!isNaN(eDate) ? Number(eMonth) : (parseInt(eMonth, 10) + 1)), (!isNaN(eDate) ? eDate : 0))).format('YYYY-mm-dd')
                  }
                }
              }
            ]
          }
        }
      },
      headers: {
        "Content-Type": "application/json"
      }
    };

    (new client()).get(es.protocol + "://" + es.host + ":" + es.port + "/" + es.index + "/visit/_search", args, function (result) {

      res
        .status(200)
        .json({
          [field]: (result && result.hits && result.hits.total
            ? result.hits.total
            : 0)
        });

    });

  }

  function fetchFP(field, sMonth, sYear, eMonth, eYear, location, res, sDate, eDate) {

    let args = {
      data: {
        query: {
          bool: {
            must: [
              {
                query_string: {
                  query: 'observation:"Sex/Pregnancy" AND observationValue:"' + field + '" AND locationType:"' + location + '"'
                }
              }, {
                range: {
                  visitDate: {
                    gte: (new Date(sYear, sMonth, (!isNaN(sDate) ? Number(sDate) : 1))).format('YYYY-mm-dd'),
                    lte: (new Date(eYear, (!isNaN(eDate) ? Number(eMonth) : (parseInt(eMonth, 10) + 1)), (!isNaN(eDate) ? eDate : 0))).format('YYYY-mm-dd')
                  }
                }
              }
            ]
          }
        }
      },
      headers: {
        "Content-Type": "application/json"
      }
    };

    (new client()).get(es.protocol + "://" + es.host + ":" + es.port + "/" + es.index + "/visit/_search", args, function (result) {

      res
        .status(200)
        .json({
          [field]: (result && result.hits && result.hits.total
            ? result.hits.total
            : 0)
        });

    });

  }

  function fetchML(field, sMonth, sYear, eMonth, eYear, location, res, sDate, eDate) {

    let args = {
      data: {
        query: {
          bool: {
            must: [
              {
                query_string: {
                  query: 'observation:"Sex/Pregnancy" AND observationValue:"' + field + '" AND locationType:"' + location + '"'
                }
              }, {
                range: {
                  visitDate: {
                    gte: (new Date(sYear, sMonth, (!isNaN(sDate) ? Number(sDate) : 1))).format('YYYY-mm-dd'),
                    lte: (new Date(eYear, (!isNaN(eDate) ? Number(eMonth) : (parseInt(eMonth, 10) + 1)), (!isNaN(eDate) ? eDate : 0))).format('YYYY-mm-dd')
                  }
                }
              }
            ]
          }
        }
      },
      headers: {
        "Content-Type": "application/json"
      }
    };

    (new client()).get(es.protocol + "://" + es.host + ":" + es.port + "/" + es.index + "/visit/_search", args, function (result) {

      res
        .status(200)
        .json({
          [field]: (result && result.hits && result.hits.total
            ? result.hits.total
            : 0)
        });

    });

  }

  function fetch0to1(field, sMonth, sYear, eMonth, eYear, location, res, sDate, eDate) {

    let args = {
      data: {
        query: {
          bool: {
            must: [
              {
                query_string: {
                  query: 'observation:"Age Group" AND observationValue:"' + field + '" AND locationType:"' + location + '"'
                }
              }, {
                range: {
                  visitDate: {
                    gte: (new Date(sYear, sMonth, (!isNaN(sDate) ? Number(sDate) : 1))).format('YYYY-mm-dd'),
                    lte: (new Date(eYear, (!isNaN(eDate) ? Number(eMonth) : (parseInt(eMonth, 10) + 1)), (!isNaN(eDate) ? eDate : 0))).format('YYYY-mm-dd')
                  }
                }
              }
            ]
          }
        }
      },
      headers: {
        "Content-Type": "application/json"
      }
    };

    (new client()).get(es.protocol + "://" + es.host + ":" + es.port + "/" + es.index + "/visit/_search", args, function (result) {

      res
        .status(200)
        .json({
          [field]: (result && result.hits && result.hits.total
            ? result.hits.total
            : 0)
        });

    });

  }

  function fetch1to14(field, sMonth, sYear, eMonth, eYear, location, res, sDate, eDate) {

    let args = {
      data: {
        query: {
          bool: {
            must: [
              {
                query_string: {
                  query: 'observation:"Age Group" AND observationValue:"' + field + '" AND locationType:"' + location + '"'
                }
              }, {
                range: {
                  visitDate: {
                    gte: (new Date(sYear, sMonth, (!isNaN(sDate) ? Number(sDate) : 1))).format('YYYY-mm-dd'),
                    lte: (new Date(eYear, (!isNaN(eDate) ? Number(eMonth) : (parseInt(eMonth, 10) + 1)), (!isNaN(eDate) ? eDate : 0))).format('YYYY-mm-dd')
                  }
                }
              }
            ]
          }
        }
      },
      headers: {
        "Content-Type": "application/json"
      }
    };

    (new client()).get(es.protocol + "://" + es.host + ":" + es.port + "/" + es.index + "/visit/_search", args, function (result) {

      res
        .status(200)
        .json({
          [field]: (result && result.hits && result.hits.total
            ? result.hits.total
            : 0)
        });

    });

  }

  function fetch12to24(field, sMonth, sYear, eMonth, eYear, location, res, sDate, eDate) {

    let args = {
      data: {
        query: {
          bool: {
            must: [
              {
                query_string: {
                  query: 'observation:"Age Group" AND observationValue:"' + field + '" AND locationType:"' + location + '"'
                }
              }, {
                range: {
                  visitDate: {
                    gte: (new Date(sYear, sMonth, (!isNaN(sDate) ? Number(sDate) : 1))).format('YYYY-mm-dd'),
                    lte: (new Date(eYear, (!isNaN(eDate) ? Number(eMonth) : (parseInt(eMonth, 10) + 1)), (!isNaN(eDate) ? eDate : 0))).format('YYYY-mm-dd')
                  }
                }
              }
            ]
          }
        }
      },
      headers: {
        "Content-Type": "application/json"
      }
    };

    (new client()).get(es.protocol + "://" + es.host + ":" + es.port + "/" + es.index + "/visit/_search", args, function (result) {

      res
        .status(200)
        .json({
          [field]: (result && result.hits && result.hits.total
            ? result.hits.total
            : 0)
        });

    });

  }

  function fetch25plus(field, sMonth, sYear, eMonth, eYear, location, res, sDate, eDate) {

    let args = {
      data: {
        query: {
          bool: {
            must: [
              {
                query_string: {
                  query: 'observation:"Age Group" AND observationValue:"' + field + '" AND locationType:"' + location + '"'
                }
              }, {
                range: {
                  visitDate: {
                    gte: (new Date(sYear, sMonth, (!isNaN(sDate) ? Number(sDate) : 1))).format('YYYY-mm-dd'),
                    lte: (new Date(eYear, (!isNaN(eDate) ? Number(eMonth) : (parseInt(eMonth, 10) + 1)), (!isNaN(eDate) ? eDate : 0))).format('YYYY-mm-dd')
                  }
                }
              }
            ]
          }
        }
      },
      headers: {
        "Content-Type": "application/json"
      }
    };

    (new client()).get(es.protocol + "://" + es.host + ":" + es.port + "/" + es.index + "/visit/_search", args, function (result) {

      res
        .status(200)
        .json({
          [field]: (result && result.hits && result.hits.total
            ? result.hits.total
            : 0)
        });

    });

  }

  function fetchNT(field, sMonth, sYear, eMonth, eYear, location, res, sDate, eDate) {

    let args = {
      data: {
        query: {
          bool: {
            must: [
              {
                query_string: {
                  query: 'observation:"Last HIV Test" AND observationValue:"' + field + '" AND locationType:"' + location + '"'
                }
              }, {
                range: {
                  visitDate: {
                    gte: (new Date(sYear, sMonth, (!isNaN(sDate) ? Number(sDate) : 1))).format('YYYY-mm-dd'),
                    lte: (new Date(eYear, (!isNaN(eDate) ? Number(eMonth) : (parseInt(eMonth, 10) + 1)), (!isNaN(eDate) ? eDate : 0))).format('YYYY-mm-dd')
                  }
                }
              }
            ]
          }
        }
      },
      headers: {
        "Content-Type": "application/json"
      }
    };

    (new client()).get(es.protocol + "://" + es.host + ":" + es.port + "/" + es.index + "/visit/_search", args, function (result) {

      res
        .status(200)
        .json({
          [field]: (result && result.hits && result.hits.total
            ? result.hits.total
            : 0)
        });

    });

  }

  function fetchPN(field, sMonth, sYear, eMonth, eYear, location, res, sDate, eDate) {

    let args = {
      data: {
        query: {
          bool: {
            must: [
              {
                query_string: {
                  query: 'observation:"Last HIV Test" AND observationValue:"' + field + '" AND locationType:"' + location + '"'
                }
              }, {
                range: {
                  visitDate: {
                    gte: (new Date(sYear, sMonth, (!isNaN(sDate) ? Number(sDate) : 1))).format('YYYY-mm-dd'),
                    lte: (new Date(eYear, (!isNaN(eDate) ? Number(eMonth) : (parseInt(eMonth, 10) + 1)), (!isNaN(eDate) ? eDate : 0))).format('YYYY-mm-dd')
                  }
                }
              }
            ]
          }
        }
      },
      headers: {
        "Content-Type": "application/json"
      }
    };

    (new client()).get(es.protocol + "://" + es.host + ":" + es.port + "/" + es.index + "/visit/_search", args, function (result) {

      res
        .status(200)
        .json({
          [field]: (result && result.hits && result.hits.total
            ? result.hits.total
            : 0)
        });

    });

  }

  function fetchPP(field, sMonth, sYear, eMonth, eYear, location, res, sDate, eDate) {

    let args = {
      data: {
        query: {
          bool: {
            must: [
              {
                query_string: {
                  query: 'observation:"Last HIV Test" AND observationValue:"' + field + '" AND locationType:"' + location + '"'
                }
              }, {
                range: {
                  visitDate: {
                    gte: (new Date(sYear, sMonth, (!isNaN(sDate) ? Number(sDate) : 1))).format('YYYY-mm-dd'),
                    lte: (new Date(eYear, (!isNaN(eDate) ? Number(eMonth) : (parseInt(eMonth, 10) + 1)), (!isNaN(eDate) ? eDate : 0))).format('YYYY-mm-dd')
                  }
                }
              }
            ]
          }
        }
      },
      headers: {
        "Content-Type": "application/json"
      }
    };

    (new client()).get(es.protocol + "://" + es.host + ":" + es.port + "/" + es.index + "/visit/_search", args, function (result) {

      res
        .status(200)
        .json({
          [field]: (result && result.hits && result.hits.total
            ? result.hits.total
            : 0)
        });

    });

  }

  function fetchPEI(field, sMonth, sYear, eMonth, eYear, location, res, sDate, eDate) {

    let args = {
      data: {
        query: {
          bool: {
            must: [
              {
                query_string: {
                  query: 'observation:"Last HIV Test" AND observationValue:"' + field + '" AND locationType:"' + location + '"'
                }
              }, {
                range: {
                  visitDate: {
                    gte: (new Date(sYear, sMonth, (!isNaN(sDate) ? Number(sDate) : 1))).format('YYYY-mm-dd'),
                    lte: (new Date(eYear, (!isNaN(eDate) ? Number(eMonth) : (parseInt(eMonth, 10) + 1)), (!isNaN(eDate) ? eDate : 0))).format('YYYY-mm-dd')
                  }
                }
              }
            ]
          }
        }
      },
      headers: {
        "Content-Type": "application/json"
      }
    };

    (new client()).get(es.protocol + "://" + es.host + ":" + es.port + "/" + es.index + "/visit/_search", args, function (result) {

      res
        .status(200)
        .json({
          [field]: (result && result.hits && result.hits.total
            ? result.hits.total
            : 0)
        });

    });

  }

  function fetchPI(field, sMonth, sYear, eMonth, eYear, location, res, sDate, eDate) {

    let args = {
      data: {
        query: {
          bool: {
            must: [
              {
                query_string: {
                  query: 'observation:"Last HIV Test" AND observationValue:"' + field + '" AND locationType:"' + location + '"'
                }
              }, {
                range: {
                  visitDate: {
                    gte: (new Date(sYear, sMonth, (!isNaN(sDate) ? Number(sDate) : 1))).format('YYYY-mm-dd'),
                    lte: (new Date(eYear, (!isNaN(eDate) ? Number(eMonth) : (parseInt(eMonth, 10) + 1)), (!isNaN(eDate) ? eDate : 0))).format('YYYY-mm-dd')
                  }
                }
              }
            ]
          }
        }
      },
      headers: {
        "Content-Type": "application/json"
      }
    };

    (new client()).get(es.protocol + "://" + es.host + ":" + es.port + "/" + es.index + "/visit/_search", args, function (result) {

      res
        .status(200)
        .json({
          [field]: (result && result.hits && result.hits.total
            ? result.hits.total
            : 0)
        });

    });

  }

  function fetchPPr(field, sMonth, sYear, eMonth, eYear, location, res, sDate, eDate) {

    let args = {
      data: {
        query: {
          bool: {
            must: [
              {
                query_string: {
                  query: 'observation:"Partner Present" AND observationValue:"Yes" AND locationType:"' + location + '"'
                }
              }, {
                range: {
                  visitDate: {
                    gte: (new Date(sYear, sMonth, (!isNaN(sDate) ? Number(sDate) : 1))).format('YYYY-mm-dd'),
                    lte: (new Date(eYear, (!isNaN(eDate) ? Number(eMonth) : (parseInt(eMonth, 10) + 1)), (!isNaN(eDate) ? eDate : 0))).format('YYYY-mm-dd')
                  }
                }
              }
            ]
          }
        }
      },
      headers: {
        "Content-Type": "application/json"
      }
    };

    (new client()).get(es.protocol + "://" + es.host + ":" + es.port + "/" + es.index + "/visit/_search", args, function (result) {

      res
        .status(200)
        .json({
          [field]: (result && result.hits && result.hits.total
            ? result.hits.total
            : 0)
        });

    });

  }

  function fetchPNP(field, sMonth, sYear, eMonth, eYear, location, res, sDate, eDate) {

    let args = {
      data: {
        query: {
          bool: {
            must: [
              {
                query_string: {
                  query: 'observation:"Partner Present" AND observationValue:"No" AND locationType' +
                    ':"' + location + '"'
                }
              }, {
                range: {
                  visitDate: {
                    gte: (new Date(sYear, sMonth, (!isNaN(sDate) ? Number(sDate) : 1))).format('YYYY-mm-dd'),
                    lte: (new Date(eYear, (!isNaN(eDate) ? Number(eMonth) : (parseInt(eMonth, 10) + 1)), (!isNaN(eDate) ? eDate : 0))).format('YYYY-mm-dd')
                  }
                }
              }
            ]
          }
        }
      },
      headers: {
        "Content-Type": "application/json"
      }
    };

    (new client()).get(es.protocol + "://" + es.host + ":" + es.port + "/" + es.index + "/visit/_search", args, function (result) {

      res
        .status(200)
        .json({
          [field]: (result && result.hits && result.hits.total
            ? result.hits.total
            : 0)
        });

    });

  }

  function fetchSN(field, sMonth, sYear, eMonth, eYear, location, res, sDate, eDate) {

    let args = {
      data: {
        query: {
          bool: {
            must: [
              {
                query_string: {
                  query: 'observation:"Outcome Summary" AND observationValue:"' + field + '" AND locationType:"' + location + '"'
                }
              }, {
                range: {
                  visitDate: {
                    gte: (new Date(sYear, sMonth, (!isNaN(sDate) ? Number(sDate) : 1))).format('YYYY-mm-dd'),
                    lte: (new Date(eYear, (!isNaN(eDate) ? Number(eMonth) : (parseInt(eMonth, 10) + 1)), (!isNaN(eDate) ? eDate : 0))).format('YYYY-mm-dd')
                  }
                }
              }
            ]
          }
        }
      },
      headers: {
        "Content-Type": "application/json"
      }
    };

    (new client()).get(es.protocol + "://" + es.host + ":" + es.port + "/" + es.index + "/visit/_search", args, function (result) {

      res
        .status(200)
        .json({
          [field]: (result && result.hits && result.hits.total
            ? result.hits.total
            : 0)
        });

    });

  }

  function fetchSP(field, sMonth, sYear, eMonth, eYear, location, res, sDate, eDate) {

    let args = {
      data: {
        query: {
          bool: {
            must: [
              {
                query_string: {
                  query: 'observation:"Outcome Summary" AND observationValue:"' + field + '" AND locationType:"' + location + '"'
                }
              }, {
                range: {
                  visitDate: {
                    gte: (new Date(sYear, sMonth, (!isNaN(sDate) ? Number(sDate) : 1))).format('YYYY-mm-dd'),
                    lte: (new Date(eYear, (!isNaN(eDate) ? Number(eMonth) : (parseInt(eMonth, 10) + 1)), (!isNaN(eDate) ? eDate : 0))).format('YYYY-mm-dd')
                  }
                }
              }
            ]
          }
        }
      },
      headers: {
        "Content-Type": "application/json"
      }
    };

    (new client()).get(es.protocol + "://" + es.host + ":" + es.port + "/" + es.index + "/visit/_search", args, function (result) {

      res
        .status(200)
        .json({
          [field]: (result && result.hits && result.hits.total
            ? result.hits.total
            : 0)
        });

    });

  }

  function fetchT12N(field, sMonth, sYear, eMonth, eYear, location, res, sDate, eDate) {

    let args = {
      data: {
        query: {
          bool: {
            must: [
              {
                query_string: {
                  query: 'observation:"Outcome Summary" AND observationValue:"' + field + '" AND locationType:"' + location + '"'
                }
              }, {
                range: {
                  visitDate: {
                    gte: (new Date(sYear, sMonth, (!isNaN(sDate) ? Number(sDate) : 1))).format('YYYY-mm-dd'),
                    lte: (new Date(eYear, (!isNaN(eDate) ? Number(eMonth) : (parseInt(eMonth, 10) + 1)), (!isNaN(eDate) ? eDate : 0))).format('YYYY-mm-dd')
                  }
                }
              }
            ]
          }
        }
      },
      headers: {
        "Content-Type": "application/json"
      }
    };

    (new client()).get(es.protocol + "://" + es.host + ":" + es.port + "/" + es.index + "/visit/_search", args, function (result) {

      res
        .status(200)
        .json({
          [field]: (result && result.hits && result.hits.total
            ? result.hits.total
            : 0)
        });

    });

  }

  function fetchT12P(field, sMonth, sYear, eMonth, eYear, location, res, sDate, eDate) {

    let args = {
      data: {
        query: {
          bool: {
            must: [
              {
                query_string: {
                  query: 'observation:"Outcome Summary" AND observationValue:"' + field + '" AND locationType:"' + location + '"'
                }
              }, {
                range: {
                  visitDate: {
                    gte: (new Date(sYear, sMonth, (!isNaN(sDate) ? Number(sDate) : 1))).format('YYYY-mm-dd'),
                    lte: (new Date(eYear, (!isNaN(eDate) ? Number(eMonth) : (parseInt(eMonth, 10) + 1)), (!isNaN(eDate) ? eDate : 0))).format('YYYY-mm-dd')
                  }
                }
              }
            ]
          }
        }
      },
      headers: {
        "Content-Type": "application/json"
      }
    };

    (new client()).get(es.protocol + "://" + es.host + ":" + es.port + "/" + es.index + "/visit/_search", args, function (result) {

      res
        .status(200)
        .json({
          [field]: (result && result.hits && result.hits.total
            ? result.hits.total
            : 0)
        });

    });

  }

  function fetchT12D(field, sMonth, sYear, eMonth, eYear, location, res, sDate, eDate) {

    let args = {
      data: {
        query: {
          bool: {
            must: [
              {
                query_string: {
                  query: 'observation:"Outcome Summary" AND observationValue:"' + field + '" AND locationType:"' + location + '"'
                }
              }, {
                range: {
                  visitDate: {
                    gte: (new Date(sYear, sMonth, (!isNaN(sDate) ? Number(sDate) : 1))).format('YYYY-mm-dd'),
                    lte: (new Date(eYear, (!isNaN(eDate) ? Number(eMonth) : (parseInt(eMonth, 10) + 1)), (!isNaN(eDate) ? eDate : 0))).format('YYYY-mm-dd')
                  }
                }
              }
            ]
          }
        }
      },
      headers: {
        "Content-Type": "application/json"
      }
    };

    (new client()).get(es.protocol + "://" + es.host + ":" + es.port + "/" + es.index + "/visit/_search", args, function (result) {

      res
        .status(200)
        .json({
          [field]: (result && result.hits && result.hits.total
            ? result.hits.total
            : 0)
        });

    });

  }

  function fetchNN(field, sMonth, sYear, eMonth, eYear, location, res, sDate, eDate) {

    let args = {
      data: {
        query: {
          bool: {
            must: [
              {
                query_string: {
                  query: 'observation:"Result Given to Client" AND observationValue:"' + field + '" AND locationType:"' + location + '"'
                }
              }, {
                range: {
                  visitDate: {
                    gte: (new Date(sYear, sMonth, (!isNaN(sDate) ? Number(sDate) : 1))).format('YYYY-mm-dd'),
                    lte: (new Date(eYear, (!isNaN(eDate) ? Number(eMonth) : (parseInt(eMonth, 10) + 1)), (!isNaN(eDate) ? eDate : 0))).format('YYYY-mm-dd')
                  }
                }
              }
            ]
          }
        }
      },
      headers: {
        "Content-Type": "application/json"
      }
    };

    (new client()).get(es.protocol + "://" + es.host + ":" + es.port + "/" + es.index + "/visit/_search", args, function (result) {

      res
        .status(200)
        .json({
          [field]: (result && result.hits && result.hits.total
            ? result.hits.total
            : 0)
        });

    });

  }

  function fetchNP(field, sMonth, sYear, eMonth, eYear, location, res, sDate, eDate) {

    let args = {
      data: {
        query: {
          bool: {
            must: [
              {
                query_string: {
                  query: 'observation:"Result Given to Client" AND observationValue:"' + field + '" AND locationType:"' + location + '"'
                }
              }, {
                range: {
                  visitDate: {
                    gte: (new Date(sYear, sMonth, (!isNaN(sDate) ? Number(sDate) : 1))).format('YYYY-mm-dd'),
                    lte: (new Date(eYear, (!isNaN(eDate) ? Number(eMonth) : (parseInt(eMonth, 10) + 1)), (!isNaN(eDate) ? eDate : 0))).format('YYYY-mm-dd')
                  }
                }
              }
            ]
          }
        }
      },
      headers: {
        "Content-Type": "application/json"
      }
    };

    (new client()).get(es.protocol + "://" + es.host + ":" + es.port + "/" + es.index + "/visit/_search", args, function (result) {

      res
        .status(200)
        .json({
          [field]: (result && result.hits && result.hits.total
            ? result.hits.total
            : 0)
        });

    });

  }

  function fetchNEI(field, sMonth, sYear, eMonth, eYear, location, res, sDate, eDate) {

    let args = {
      data: {
        query: {
          bool: {
            must: [
              {
                query_string: {
                  query: 'observation:"Result Given to Client" AND observationValue:"' + field + '" AND locationType:"' + location + '"'
                }
              }, {
                range: {
                  visitDate: {
                    gte: (new Date(sYear, sMonth, (!isNaN(sDate) ? Number(sDate) : 1))).format('YYYY-mm-dd'),
                    lte: (new Date(eYear, (!isNaN(eDate) ? Number(eMonth) : (parseInt(eMonth, 10) + 1)), (!isNaN(eDate) ? eDate : 0))).format('YYYY-mm-dd')
                  }
                }
              }
            ]
          }
        }
      },
      headers: {
        "Content-Type": "application/json"
      }
    };

    (new client()).get(es.protocol + "://" + es.host + ":" + es.port + "/" + es.index + "/visit/_search", args, function (result) {

      res
        .status(200)
        .json({
          [field]: (result && result.hits && result.hits.total
            ? result.hits.total
            : 0)
        });

    });

  }

  function fetchNI(field, sMonth, sYear, eMonth, eYear, location, res, sDate, eDate) {

    let args = {
      data: {
        query: {
          bool: {
            must: [
              {
                query_string: {
                  query: 'observation:"Result Given to Client" AND observationValue:"' + field + '" AND locationType:"' + location + '"'
                }
              }, {
                range: {
                  visitDate: {
                    gte: (new Date(sYear, sMonth, (!isNaN(sDate) ? Number(sDate) : 1))).format('YYYY-mm-dd'),
                    lte: (new Date(eYear, (!isNaN(eDate) ? Number(eMonth) : (parseInt(eMonth, 10) + 1)), (!isNaN(eDate) ? eDate : 0))).format('YYYY-mm-dd')
                  }
                }
              }
            ]
          }
        }
      },
      headers: {
        "Content-Type": "application/json"
      }
    };

    (new client()).get(es.protocol + "://" + es.host + ":" + es.port + "/" + es.index + "/visit/_search", args, function (result) {

      res
        .status(200)
        .json({
          [field]: (result && result.hits && result.hits.total
            ? result.hits.total
            : 0)
        });

    });

  }

  function fetchCP(field, sMonth, sYear, eMonth, eYear, location, res, sDate, eDate) {

    let args = {
      data: {
        query: {
          bool: {
            must: [
              {
                query_string: {
                  query: 'observation:"Result Given to Client" AND observationValue:"' + field + '" AND locationType:"' + location + '"'
                }
              }, {
                range: {
                  visitDate: {
                    gte: (new Date(sYear, sMonth, (!isNaN(sDate) ? Number(sDate) : 1))).format('YYYY-mm-dd'),
                    lte: (new Date(eYear, (!isNaN(eDate) ? Number(eMonth) : (parseInt(eMonth, 10) + 1)), (!isNaN(eDate) ? eDate : 0))).format('YYYY-mm-dd')
                  }
                }
              }
            ]
          }
        }
      },
      headers: {
        "Content-Type": "application/json"
      }
    };

    (new client()).get(es.protocol + "://" + es.host + ":" + es.port + "/" + es.index + "/visit/_search", args, function (result) {

      res
        .status(200)
        .json({
          [field]: (result && result.hits && result.hits.total
            ? result.hits.total
            : 0)
        });

    });

  }

  function fetchCI(field, sMonth, sYear, eMonth, eYear, location, res, sDate, eDate) {

    let args = {
      data: {
        query: {
          bool: {
            must: [
              {
                query_string: {
                  query: 'observation:"Result Given to Client" AND observationValue:"' + field + '" AND locationType:"' + location + '"'
                }
              }, {
                range: {
                  visitDate: {
                    gte: (new Date(sYear, sMonth, (!isNaN(sDate) ? Number(sDate) : 1))).format('YYYY-mm-dd'),
                    lte: (new Date(eYear, (!isNaN(eDate) ? Number(eMonth) : (parseInt(eMonth, 10) + 1)), (!isNaN(eDate) ? eDate : 0))).format('YYYY-mm-dd')
                  }
                }
              }
            ]
          }
        }
      },
      headers: {
        "Content-Type": "application/json"
      }
    };

    (new client()).get(es.protocol + "://" + es.host + ":" + es.port + "/" + es.index + "/visit/_search", args, function (result) {

      res
        .status(200)
        .json({
          [field]: (result && result.hits && result.hits.total
            ? result.hits.total
            : 0)
        });

    });

  }

  function fetchPITC(field, sMonth, sYear, eMonth, eYear, location, res, sDate, eDate) {

    let args = {
      data: {
        query: {
          bool: {
            must: [
              {
                query_string: {
                  query: 'observation:"HTS Access Type" AND observationValue:"' + field + '" AND locationType:"' + location + '"'
                }
              }, {
                range: {
                  visitDate: {
                    gte: (new Date(sYear, sMonth, (!isNaN(sDate) ? Number(sDate) : 1))).format('YYYY-mm-dd'),
                    lte: (new Date(eYear, (!isNaN(eDate) ? Number(eMonth) : (parseInt(eMonth, 10) + 1)), (!isNaN(eDate) ? eDate : 0))).format('YYYY-mm-dd')
                  }
                }
              }
            ]
          }
        }
      },
      headers: {
        "Content-Type": "application/json"
      }
    };

    (new client()).get(es.protocol + "://" + es.host + ":" + es.port + "/" + es.index + "/visit/_search", args, function (result) {

      res
        .status(200)
        .json({
          [field]: (result && result.hits && result.hits.total
            ? result.hits.total
            : 0)
        });

    });

  }

  function fetchFRS(field, sMonth, sYear, eMonth, eYear, location, res, sDate, eDate) {

    let args = {
      data: {
        query: {
          bool: {
            must: [
              {
                query_string: {
                  query: 'observation:"HTS Access Type" AND observationValue:"' + field + '" AND locationType:"' + location + '"'
                }
              }, {
                range: {
                  visitDate: {
                    gte: (new Date(sYear, sMonth, (!isNaN(sDate) ? Number(sDate) : 1))).format('YYYY-mm-dd'),
                    lte: (new Date(eYear, (!isNaN(eDate) ? Number(eMonth) : (parseInt(eMonth, 10) + 1)), (!isNaN(eDate) ? eDate : 0))).format('YYYY-mm-dd')
                  }
                }
              }
            ]
          }
        }
      },
      headers: {
        "Content-Type": "application/json"
      }
    };

    (new client()).get(es.protocol + "://" + es.host + ":" + es.port + "/" + es.index + "/visit/_search", args, function (result) {

      res
        .status(200)
        .json({
          [field]: (result && result.hits && result.hits.total
            ? result.hits.total
            : 0)
        });

    });

  }

  function fetchOV(field, sMonth, sYear, eMonth, eYear, location, res, sDate, eDate) {

    let args = {
      data: {
        query: {
          bool: {
            must: [
              {
                query_string: {
                  query: 'observation:"HTS Access Type" AND observationValue:"' + field + '" AND locationType:"' + location + '"'
                }
              }, {
                range: {
                  visitDate: {
                    gte: (new Date(sYear, sMonth, (!isNaN(sDate) ? Number(sDate) : 1))).format('YYYY-mm-dd'),
                    lte: (new Date(eYear, (!isNaN(eDate) ? Number(eMonth) : (parseInt(eMonth, 10) + 1)), (!isNaN(eDate) ? eDate : 0))).format('YYYY-mm-dd')
                  }
                }
              }
            ]
          }
        }
      },
      headers: {
        "Content-Type": "application/json"
      }
    };

    (new client()).get(es.protocol + "://" + es.host + ":" + es.port + "/" + es.index + "/visit/_search", args, function (result) {

      res
        .status(200)
        .json({
          [field]: (result && result.hits && result.hits.total
            ? result.hits.total
            : 0)
        });

    });

  }

  function fetchSS(field, sMonth, sYear, eMonth, eYear, location, res, sDate, eDate) {

    let args = {
      data: {
        query: {
          bool: {
            must: [
              {
                query_string: {
                  query: 'observation:"HTS Family Referral Slips" AND locationType:"' + location + '"'
                }
              }, {
                range: {
                  visitDate: {
                    gte: (new Date(sYear, sMonth, (!isNaN(sDate) ? Number(sDate) : 1))).format('YYYY-mm-dd'),
                    lte: (new Date(eYear, (!isNaN(eDate) ? Number(eMonth) : (parseInt(eMonth, 10) + 1)), (!isNaN(eDate) ? eDate : 0))).format('YYYY-mm-dd')
                  }
                }
              }
            ]
          }
        },
        aggs: {
          slips: {
            sum: {
              field: "observationNumber"
            }
          }
        }
      },
      headers: {
        "Content-Type": "application/json"
      }
    };

    (new client()).get(es.protocol + "://" + es.host + ":" + es.port + "/" + es.index + "/visit/_search", args, function (result) {

      debug(JSON.stringify(result));

      res
        .status(200)
        .json({
          [field]: (result && result.aggregations && result.aggregations.slips && result.aggregations.slips.value
            ? result.aggregations.slips.value
            : 0)
        });

    });

  }

  function fetchTest1UsedForClients(field, sMonth, sYear, eMonth, eYear, location, res, sDate, eDate) {

    let args = {
      data: {
        query: {
          bool: {
            must: [
              {
                query_string: {
                  query: "(observation:\"Immediate Repeat Test 1 Result\" OR observation:\"First Pass Test" +
                    " 1 Result\") AND locationType:\"" + location + "\""
                }
              }, {
                range: {
                  visitDate: {
                    gte: (new Date(sYear, sMonth, (!isNaN(sDate) ? Number(sDate) : 1))).format('YYYY-mm-dd'),
                    lte: (new Date(eYear, (!isNaN(eDate) ? Number(eMonth) : (parseInt(eMonth, 10) + 1)), (!isNaN(eDate) ? eDate : 0))).format('YYYY-mm-dd')
                  }
                }
              }
            ]
          }
        }
      },
      headers: {
        "Content-Type": "application/json"
      }
    };

    (new client()).get(es.protocol + "://" + es.host + ":" + es.port + "/" + es.index + "/visit/_search", args, function (result) {

      res
        .status(200)
        .json({
          [field]: (result && result.hits && result.hits.total
            ? result.hits.total
            : 0)
        });

    });

  }

  function fetchTest2UsedForClients(field, sMonth, sYear, eMonth, eYear, location, res, sDate, eDate) {

    let args = {
      data: {
        query: {
          bool: {
            must: [
              {
                query_string: {
                  query: "(observation:\"Immediate Repeat Test 2 Result\" OR observation:\"First Pass Test" +
                    " 2 Result\") AND locationType:\"" + location + "\""
                }
              }, {
                range: {
                  visitDate: {
                    gte: (new Date(sYear, sMonth, (!isNaN(sDate) ? Number(sDate) : 1))).format('YYYY-mm-dd'),
                    lte: (new Date(eYear, (!isNaN(eDate) ? Number(eMonth) : (parseInt(eMonth, 10) + 1)), (!isNaN(eDate) ? eDate : 0))).format('YYYY-mm-dd')
                  }
                }
              }
            ]
          }
        }
      },
      headers: {
        "Content-Type": "application/json"
      }
    };

    (new client()).get(es.protocol + "://" + es.host + ":" + es.port + "/" + es.index + "/visit/_search", args, function (result) {

      res
        .status(200)
        .json({
          [field]: (result && result.hits && result.hits.total
            ? result.hits.total
            : 0)
        });

    });

  }

  router.get('/reports', function (req, res, next) {

    const url_parts = url.parse(req.url, true);

    const query = url_parts.query;

    debug(JSON.stringify(query));

    const field = decodeURIComponent(query.f);
    const location = decodeURIComponent(query.l);
    const sMonth = decodeURIComponent(query.sm);
    const sYear = decodeURIComponent(query.sy);
    const sDate = decodeURIComponent(query.sd);
    const eMonth = decodeURIComponent(query.em);
    const eYear = decodeURIComponent(query.ey);
    const eDate = decodeURIComponent(query.ed);

    const concepts = {
      "Male": fetchML,
      "Female Non-Pregnant": fetchFNP,
      "Female Pregnant": fetchFP,
      "0-11 months": fetch0to1,
      "1-14 years": fetch1to14,
      "15-24 years": fetch12to24,
      "25+ years": fetch25plus,
      "Never Tested": fetchNT,
      "Last Negative": fetchPN,
      "Last Positive": fetchPP,
      "Last Exposed infant": fetchPEI,
      "Last Inconclusive": fetchPI,
      "Partner Present": fetchPPr,
      "Partner not present": fetchPNP,
      "Single Negative": fetchSN,
      "Single Positive": fetchSP,
      "Test 1 & 2 Negative": fetchT12N,
      "Test 1 & 2 Positive": fetchT12P,
      "Test 1 & 2 Discordant": fetchT12D,
      "New negative": fetchNN,
      "New positive": fetchNP,
      "New exposed infant": fetchNEI,
      "New inconclusive": fetchNI,
      "Confirmatory positive": fetchCP,
      "Confirmatory Inconclusive": fetchCI,
      "Routine HTS (PITC) within Health Service": fetchPITC,
      "Comes with HTS Family Referral Slip": fetchFRS,
      "Other (VCT, etc.)": fetchOV,
      "Sum of all slips": fetchSS,
      "Test 1 Used for Clients": fetchTest1UsedForClients,
      "Test 2 Used for Clients": fetchTest2UsedForClients
    };

    if (field && concepts[field]) {

      concepts[field](field, sMonth, sYear, eMonth, eYear, location, res, sDate, eDate);

    } else {

      res
        .status(200)
        .json({});

    }

  });

  router.get('/raw', function (req, res, next) {

    const url_parts = url.parse(req.url, true);

    const query = url_parts.query;

    const sMonth = decodeURIComponent(query.sm);
    const sYear = decodeURIComponent(query.sy);
    const sDate = decodeURIComponent(query.sd);
    const eMonth = decodeURIComponent(query.em);
    const eYear = decodeURIComponent(query.ey);
    const eDate = decodeURIComponent(query.ed);

    res.set('Content-Type', 'application/json');

    esClient.search({
      index: es.index,
      from: (query.f
        ? query.f
        : 0),
      size: (query.s
        ? query.s
        : 10000),
      body: {
        _source: "",
        query: {
          bool: {
            must: [
              {
                range: {
                  visitDate: {
                    gte: (new Date(sYear, sMonth, (!isNaN(sDate) ? Number(sDate) : 1))).format("YYYY-mm-dd"),
                    lte: (new Date(eYear, (!isNaN(eDate) ? Number(eMonth) : (parseInt(eMonth, 10) + 1)), (!isNaN(eDate) ? eDate : 0))).format("YYYY-mm-dd")
                  }
                }
              }
            ]
          }
        },
        aggs: {
          raw: {
            terms: {
              field: "serviceDeliveryPoint.keyword",
              size: 10000
            },
            aggs: {
              client: {
                terms: {
                  field: "identifier.keyword",
                  size: 10000
                },
                aggs: {
                  visit: {
                    terms: {
                      field: "visitDate",
                      size: 10000
                    },
                    aggs: {
                      obs: {
                        terms: {
                          field: "observation.keyword",
                          size: 10000
                        },
                        aggs: {
                          value: {
                            terms: {
                              field: "observationValue.keyword",
                              size: 10000
                            },
                            aggs: {
                              dob: {
                                terms: {
                                  field: "dateOfBirth",
                                  size: 10000
                                }
                              },
                              user: {
                                terms: {
                                  field: "user.keyword",
                                  size: 10000
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }, (e, resp) => {

      if (!resp.aggregations)
        return res.end();

      for (let row of resp.aggregations.raw.buckets) {

        const location = row.key;

        for (let client of row.client.buckets) {

          const clientId = client.key;

          for (let visit of client.visit.buckets) {

            const visitDate = (new Date(visit.key)).format("d mmm YYYY");

            let chunk = {
              "Service Delivery Point": location,
              "Entry Code": clientId,
              "Visit Date": visitDate
            };

            for (let obs of visit.obs.buckets) {

              let concept = obs.key;

              for (let obsValue of obs.value.buckets) {

                let value = obsValue.key;

                for (let user of obsValue.user.buckets) {

                  if (concept === "Time since last HIV Test") {

                    chunk["Time Since Last Test"] = value;

                  } else if (concept === "Last HIV Test") {

                    chunk["Last HIV Test Result"] = value;

                  } else if (concept === "HTS Family Referral Slips") {

                    chunk["HTS Family Ref Slips"] = value;

                  } else {

                    chunk[concept] = value;

                  }

                  if (obsValue.dob && obsValue.dob.buckets && obsValue.dob.buckets.length > 0) {

                    chunk["Date of Birth"] = (new Date(obsValue.dob.buckets[0].key)).format("d mmm YYYY");

                  }

                  chunk["HTS Provider ID"] = user.key;

                }

              }

            }

            res.write(JSON.stringify([
              {
                row: chunk
              }
            ]));

          }

        }

      }

      res.end();

    });

  })

  router.get('/test_kits', function (req, res, next) {

    const url_parts = url.parse(req.url, true);

    const query = url_parts.query;

    debug(JSON.stringify(query));

    const sMonth = decodeURIComponent(query.sm);
    const sYear = decodeURIComponent(query.sy);
    const kitType = decodeURIComponent(query.t);
    const kitName = decodeURIComponent(query.n);
    const locationName = decodeURIComponent(query.l);

    res.set('Content-Type', 'application/json');

    esClient.search({
      index: es.index,
      from: (query.f
        ? query.f
        : 0),
      size: (query.s
        ? query.s
        : 10000),
      body: {
        _source: "",
        query: {
          bool: {
            must: [
              {
                query_string: {
                  query: (kitType.match(/1/)
                    ? "(observation:\"Immediate Repeat Test 1 Result\" OR observation:\"First Pass Test" +
                    " 1 Result\")"
                    : "(observation:\"Immediate Repeat Test 2 Result\" OR observation:\"First Pass Test" +
                    " 2 Result\")") + " AND locationType:\"" + locationName + "\""
                }
              }, {
                range: {
                  visitDate: {
                    gte: (new Date(sYear, sMonth, 1)).format("YYYY-mm-dd"),
                    lte: (new Date(sYear, sMonth + 1, 0)).format("YYYY-mm-dd")
                  }
                }
              }
            ]
          }
        },
        aggs: {
          visit: {
            terms: {
              field: "visitDate",
              size: 10000
            }
          }
        }
      }
    }, (e, resp) => {

      if (!resp.aggregations)
        return res.end();

      for (let visit of resp.aggregations.visit.buckets) {

        const visitDate = (new Date(visit.key)).format("d mmm YYYY");

        let chunk = {
          KitName: kitName,
          Location: locationName,
          Date: visitDate,
          Kits: visit.doc_count
        };

        res.write(JSON.stringify([
          {
            row: chunk
          }
        ]));

      }

      res.end();

    });

  })

  router.get('/disaggregated', function (req, res, next) {

    const url_parts = url.parse(req.url, true);

    const query = url_parts.query;

    const sMonth = decodeURIComponent(query.sm);
    const sYear = decodeURIComponent(query.sy);
    const eMonth = decodeURIComponent(query.em);
    const eYear = decodeURIComponent(query.ey);

    res.set('Content-Type', 'application/json');

    const ageGroups = [
      ["<1"],
      [
        1, 4
      ],
      [
        5, 9
      ],
      [
        10, 14
      ],
      [
        15, 19
      ],
      [
        20, 24
      ],
      [
        25, 29
      ],
      [
        30, 34
      ],
      [
        35, 39
      ],
      [
        40, 44
      ],
      [
        45, 49
      ],
      [">=50"]
    ];

    async.mapSeries(ageGroups, (group, cb) => {

      esClient.search({
        index: es.index,
        from: (query.f
          ? query.f
          : 0),
        size: (query.s
          ? query.s
          : 10000),
        body: {
          _source: "",
          query: {
            bool: {
              must: [
                {
                  query_string: {
                    query: (group.length === 1
                      ? `age:${group[0]}`
                      : `age:>=${group[0]} AND age:<=${parseFloat(group[1]) + 0.99999}`)
                  }
                }, {
                  range: {
                    visitDate: {
                      gte: (new Date(sYear, sMonth, 1)).format("YYYY-mm-dd"),
                      lte: (new Date(eYear, parseInt(eMonth, 10) + 1, 0)).format("YYYY-mm-dd")
                    }
                  }
                }
              ]
            }
          },
          aggs: {
            year: {
              terms: {
                field: "year",
                size: 10000
              },
              aggs: {
                month: {
                  terms: {
                    field: "month.keyword",
                    size: 10000
                  },
                  aggs: {
                    serviceDeliveryPoint: {
                      terms: {
                        field: "serviceDeliveryPoint.keyword",
                        size: 10000
                      },
                      aggs: {
                        htsAccessType: {
                          terms: {
                            field: "htsAccessType.keyword",
                            size: 10000
                          },
                          aggs: {
                            gender: {
                              terms: {
                                field: "gender.keyword",
                                size: 10000
                              },
                              aggs: {
                                resultGiven: {
                                  terms: {
                                    field: "resultGiven.keyword",
                                    size: 10000
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }, (e, resp) => {

        if (!resp.aggregations)
          return cb();

        for (let year of resp.aggregations.year.buckets) {

          for (let month of year.month.buckets) {

            for (let serviceDeliveryPoint of month.serviceDeliveryPoint.buckets) {

              for (let htsAccessType of serviceDeliveryPoint.htsAccessType.buckets) {

                for (let gender of htsAccessType.gender.buckets) {

                  for (let resultGiven of gender.resultGiven.buckets) {

                    let chunk = {
                      "Site": site.facility,
                      "Age Group": (group[0] === ">=50"
                        ? "50+"
                        : group.join("-")),
                      "Month": month.key,
                      "Year": year.key,
                      "Service Delivery Point": serviceDeliveryPoint.key,
                      "HTS Access Type": htsAccessType.key,
                      "Sex": {
                        "M": "Male",
                        "F": "Female"
                      }[gender.key],
                      "Result Given": resultGiven.key,
                      "Count": resultGiven.doc_count
                    };

                    res.write(JSON.stringify([
                      {
                        row: chunk
                      }
                    ]));

                  }

                }

              }

            }

          }

        }

        cb();

      });

    }, (e) => {

      if (e)
        console.log(e);


      res.end();

    })

  })

  router.get('/visit_summaries', function (req, res, next) {

    const url_parts = url.parse(req.url, true);

    const query = url_parts.query;

    const month = decodeURIComponent(query.m);
    const year = decodeURIComponent(query.y);
    const date = padZeros((new Date()).getDate(), 2)

    res.set('Content-Type', 'application/json');

    esClient.search({
      index: es.index,
      from: (query.f
        ? query.f
        : 0),
      size: (query.s
        ? query.s
        : 10000),
      body: {
        query: {
          match: {
            visitDate: (new Date(year, month, date)).format("YYYY-mm-dd")
          }
        },
        aggs: {
          visit: {
            terms: {
              field: "visitDate",
              size: 10000,
              order: {
                _term: "desc"
              }
            },
            aggs: {
              location: {
                terms: {
                  field: "location.keyword",
                  size: 10000,
                  order: {
                    _term: "desc"
                  }
                },
                aggs: {
                  user: {
                    terms: {
                      field: "user.keyword",
                      size: 10000,
                      order: {
                        _term: "desc"
                      }
                    },
                    aggs: {
                      clients: {
                        terms: {
                          field: "identifier.keyword",
                          size: 10000
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }, (e, resp) => {

      if (!resp.aggregations)
        return res.end();

      for (let visit of resp.aggregations.visit.buckets) {

        const visitDate = (new Date(visit.key)).format("d mmm YYYY");

        for (let row of visit.location.buckets) {

          const location = row.key;

          for (let user of row.user.buckets) {

            const username = user.key;

            let chunk = {
              Location: location,
              User: username,
              Date: visitDate,
              Total: user.clients.buckets.length
            };

            res.write(JSON.stringify([
              {
                row: chunk
              }
            ]));

          }

        }

      }

      res.end();

    });

  })

  router.get('/disaggregated_row', function (req, res, next) {

    const url_parts = url.parse(req.url, true);

    const query = url_parts.query;

    const month = decodeURIComponent(query.m);
    const year = decodeURIComponent(query.y);
    const location = decodeURIComponent(query.l);
    const htsAccessType = decodeURIComponent(query.t);
    const group = JSON.parse(decodeURIComponent(query.g));
    const gender = decodeURIComponent(query.s);
    const resultGiven = decodeURIComponent(query.r);

    debug(group);

    let args = {
      data: {
        query: {
          bool: {
            must: [
              {
                query_string: {
                  query: (group.length === 1
                    ? `age:${group[0]}`
                    : `age:>=${group[0]} AND age:<=${parseFloat(group[1]) + 0.99999}`) + ` AND serviceDeliveryPoint:"${location}" AND htsAccessType:"${htsAccessType}" AND gender:"${gender}" AND resultGiven:"${resultGiven}"`
                }
              }, {
                range: {
                  visitDate: {
                    gte: (new Date(year, month, 1)),
                    lte: (new Date(year, month + 1, 0))
                  }
                }
              }
            ]
          }
        }
      },
      headers: {
        "Content-Type": "application/json"
      }
    };

    debug(JSON.stringify(args));

    (new client()).get(es.protocol + "://" + es.host + ":" + es.port + "/" + es.index + "/pepfar/_search", args, function (result) {

      debug(result);

      res
        .status(200)
        .json({
          count: (result && result.hits && result.hits.total
            ? result.hits.total
            : 0)
        });

    });

  })

  router.get('/filtered_visit_summaries', function (req, res, next) {

    const url_parts = url.parse(req.url, true);

    const query = url_parts.query;

    debug(JSON.stringify(query));

    const months = {
      January: 0,
      February: 1,
      March: 2,
      April: 3,
      May: 4,
      June: 5,
      July: 6,
      August: 7,
      September: 8,
      October: 9,
      November: 10,
      December: 11
    };

    const month1 = months[decodeURIComponent(query.m1)];
    const year1 = decodeURIComponent(query.y1);
    const date1 = decodeURIComponent(query.d1);

    const month2 = months[decodeURIComponent(query.m2)];
    const year2 = decodeURIComponent(query.y2);
    const date2 = decodeURIComponent(query.d2);

    res.set('Content-Type', 'application/json');

    esClient.search({
      index: es.index,
      from: (query.f
        ? query.f
        : 0),
      size: (query.s
        ? query.s
        : 10000),
      body: {
        query: {
          bool: {
            must: [
              {
                range: {
                  visitDate: {
                    gte: (new Date(year1, month1, date1)).format("YYYY-mm-dd"),
                    lte: (new Date(year2, month2, date2)).format("YYYY-mm-dd")
                  }
                }
              }
            ]
          }
        },
        aggs: {
          visit: {
            terms: {
              field: (month1 !== month2 ? "visitDate" : "visitDate"),
              size: 10000,
              order: {
                _term: "desc"
              }
            },
            aggs: {
              location: {
                terms: {
                  field: "location.keyword",
                  size: 10000,
                  order: {
                    _term: "desc"
                  }
                },
                aggs: {
                  user: {
                    terms: {
                      field: "user.keyword",
                      size: 10000,
                      order: {
                        _term: "desc"
                      }
                    },
                    aggs: {
                      clients: {
                        terms: {
                          field: "identifier.keyword",
                          size: 10000
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }, (e, resp) => {

      if (!resp.aggregations)
        return res.end();

      const datasource = app.dataSources.hts;

      const sql = 'SELECT username, given_name, family_name FROM users LEFT OUTER JOIN person ON person.person_id = users.person_id LEFT OUTER JOIN person_name ON person_name.person_id = person.person_id WHERE person.voided = 0';

      const sqlParams = [];

      datasource.connector.execute(sql, sqlParams, (err, data) => {

        if (err) {

          console.log(err);

          res.end();

        }

        let usernames = {};

        data.forEach(row => {

          usernames[row.username] = {
            firstName: row.given_name,
            lastName: row.family_name
          };

        })

        debug(usernames);

        for (let visit of resp.aggregations.visit.buckets) {

          const visitDate = (new Date(visit.key)).format("d mmm YYYY");

          for (let row of visit.location.buckets) {

            const location = row.key;

            for (let user of row.user.buckets) {

              const username = user.key;

              let chunk = {
                Location: location,
                'First Name': usernames[username].firstName,
                'Last Name': usernames[username].lastName,
                User: username,
                Date: visitDate,
                Total: user.clients.buckets.length
              };

              res.write(JSON.stringify([
                {
                  row: chunk
                }
              ]));

            }

          }

        }

        res.end();

      });

    });



  })

  router.get('/full_disaggregated', (req, res, next) => {

    const query = req.query;

    debug(JSON.stringify(query));

    const sMonth = decodeURIComponent(query.sm);
    const sYear = decodeURIComponent(query.sy);
    const sDate = decodeURIComponent(query.sd);
    const eMonth = decodeURIComponent(query.em);
    const eYear = decodeURIComponent(query.ey);
    const eDate = decodeURIComponent(query.ed);

    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December"
    ];

    const htsAccessTypes = ["PITC", "FRS/Index", "VCT/Other"];

    const genders = ["M", "F"];

    const resultGivens = ["Negative", "Positive"];

    const facility = site.facility;

    const district = site.location;

    let years = {};

    let period = parseInt((((new Date(eYear, parseInt(eMonth, 10), 1)) - (new Date(sYear, parseInt(sMonth, 10), 1))) / (1000 * 60 * 60 * 24 * 30)), 10);

    let trackDate = (new Date(sYear, parseInt(sMonth, 10), 1));

    for (let i = 0; i <= period; i++) {

      if (!years[trackDate.getFullYear()]) {

        years[trackDate.getFullYear()] = [];

      }

      if (years[trackDate.getFullYear()].indexOf(months[trackDate.getMonth()]) < 0) {

        years[trackDate.getFullYear()].push(months[trackDate.getMonth()]);

      }

      trackDate.setMonth(trackDate.getMonth() + 1);

    }

    debug(JSON.stringify(years));

    debug(trackDate);

    const ageGroups = {
      "0.0-0.9999999": "<1",
      "1.0-4.9999999": "1-4",
      "5.0-9.9999999": "5-9",
      "10.0-14.9999999": "10-14",
      "15.0-19.9999999": "15-19",
      "20.0-24.9999999": "20-24",
      "25.0-29.9999999": "25-29",
      "30.0-34.9999999": "30-34",
      "35.0-39.9999999": "35-39",
      "40.0-44.9999999": "40-44",
      "45.0-49.9999999": "45-49",
      "50.0-120.0": ">=50"
    };

    const ageRanges = [
      "<1",
      "1-4",
      "5-9",
      "10-14",
      "15-19",
      "20-24",
      "25-29",
      "30-34",
      "35-39",
      "40-44",
      "45-49",
      ">=50"
    ];

    const download = (query.d
      ? true
      : false);
    const startPos = (query.s
      ? query.s
      : 0);
    const endPos = (query.e
      ? query.e
      : 20);

    debug((new Date(eYear, parseInt(eMonth, 10) + 1, 0)).format('YYYY-mm-dd'));

    let args = {
      data: {
        _source: "enteryCode",
        query: {
          bool: {
            must: [
              {
                range: {
                  visitDate: {
                    gte: (new Date(sYear, parseInt(sMonth, 10), (!isNaN(sDate) ? Number(sDate) : 1))).format('YYYY-mm-dd'),
                    lte: (new Date(eYear, (!isNaN(eDate) ? Number(eMonth) : (parseInt(eMonth, 10) + 1)), (!isNaN(eDate) ? eDate : 0))).format('YYYY-mm-dd')
                  }
                }
              }
            ]
          }
        },
        aggs: {
          year: {
            terms: {
              field: "year",
              size: 10000
            },
            aggs: {
              month: {
                terms: {
                  field: "month.keyword",
                  size: 10000
                },
                aggs: {
                  modality: {
                    terms: {
                      field: "htsModality.keyword",
                      size: 10000
                    },
                    aggs: {
                      accessType: {
                        terms: {
                          field: "htsAccessType.keyword",
                          size: 10000
                        },
                        aggs: {
                          gender: {
                            terms: {
                              field: "gender.keyword",
                              size: 10000
                            },
                            aggs: {
                              result: {
                                terms: {
                                  field: "resultGiven.keyword",
                                  size: 10000
                                },
                                aggs: {
                                  age: {
                                    range: {
                                      field: "age",
                                      ranges: [
                                        {
                                          from: 0,
                                          to: 0.9999999
                                        },
                                        {
                                          from: 1,
                                          to: 4.9999999
                                        },
                                        {
                                          from: 5,
                                          to: 9.9999999
                                        },
                                        {
                                          from: 10,
                                          to: 14.9999999
                                        },
                                        {
                                          from: 15,
                                          to: 19.9999999
                                        },
                                        {
                                          from: 20,
                                          to: 24.9999999
                                        },
                                        {
                                          from: 25,
                                          to: 29.9999999
                                        },
                                        {
                                          from: 30,
                                          to: 34.9999999
                                        },
                                        {
                                          from: 35,
                                          to: 39.9999999
                                        },
                                        {
                                          from: 40,
                                          to: 44.9999999
                                        },
                                        {
                                          from: 45,
                                          to: 49.9999999
                                        },
                                        {
                                          from: 50,
                                          to: 120
                                        }
                                      ]
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      headers: {
        "Content-Type": "application/json"
      }
    };

    if (query.m) {

      args.data.query.bool.must.push({
        query_string: {
          query: "htsModality:\"" + String(query.m).trim() + "\""
        }
      });

    }

    debug(JSON.stringify(args.data));

    (new client()).get(es.protocol + "://" + es.host + ":" + es.port + "/" + es.index + "/pepfar/_search", args, function (result) {

      const header = [
        "District",
        "Site",
        "Month",
        "Year",
        "HTS Modality",
        "HTS Access Type",
        "Age Group",
        "Sex",
        "Result Given",
        "Count"
      ];

      let data = {};

      result.aggregations.year.buckets.map(rowY => {

        const year = rowY.key;

        data[year] = {};

        rowY.month.buckets.map(rowM => {

          const month = rowM.key;

          data[year][month] = {};

          rowM.modality.buckets.map(rowD => {

            const modality = rowD.key;

            data[year][month][modality] = {};

            rowD.accessType.buckets.map(rowA => {

              const accessType = rowA.key;

              data[year][month][modality][accessType] = {};

              rowA.gender.buckets.map(rowG => {

                const gender = rowG.key;

                data[year][month][modality][accessType][gender] = {};

                rowG.result.buckets.map(rowR => {

                  const result = rowR.key;

                  data[year][month][modality][accessType][gender][result] = {};

                  rowR.age.buckets.map(rowE => {

                    const age = ageGroups[rowE.key];

                    data[year][month][modality][accessType][gender][result][age] = rowE.doc_count;

                  })

                })

              })

            })

          })

        })

      });

      debug(JSON.stringify(data, null, 2));

      let json = [];

      if (download) {

        json.push(header.join('\t'));

      } else {

        res.set('Content-Type', 'application/json');

      }

      let k = 0;

      async.mapSeries(Object.keys(years), (year, yCb) => {

        if (!year)
          return res.status(200).json(json);

        async.mapSeries(years[year], (month, mCb) => {

          if (!month)
            return res.status(200).json(json);

          async.mapSeries((query.m ? [query.m] : htsModalities), (modality, lCb) => {

            if (!modality)
              return res.status(200).json(json);

            async.mapSeries(htsAccessTypes, (accessType, hCb) => {

              if (!accessType)
                return res.status(200).json(json);

              async.mapSeries(genders, (gender, gCb) => {

                if (!gender)
                  return res.status(200).json(json);

                async.mapSeries(resultGivens, (result, rCb) => {

                  if (!result)
                    return res.status(200).json(json);

                  async.mapSeries(ageRanges, (ageGroup, aCb) => {

                    if (!ageGroup)
                      return res.status(200).json(json);

                    const group = ageGroup.split("-");

                    let count = 0;

                    if (Object.keys(data).indexOf(year) >= 0 &&
                      Object.keys(data[year]).indexOf(month) >= 0 &&
                      Object.keys(data[year][month]).indexOf(modality) >= 0 &&
                      Object.keys(data[year][month][modality]).indexOf(accessType) >= 0 &&
                      Object.keys(data[year][month][modality][accessType]).indexOf(gender) >= 0 &&
                      Object.keys(data[year][month][modality][accessType][gender]).indexOf(result) >= 0 &&
                      Object.keys(data[year][month][modality][accessType][gender][result]).indexOf(ageGroup) >= 0) {

                      count = data[year][month][modality][accessType][gender][result][ageGroup];

                      if (count > 0) {

                        debug(modality + " : " + accessType + " : " + count);

                      }

                    }

                    if ((k >= startPos && k < endPos) && !download) {

                      let row = {
                        "Pos": k,
                        "District": district,
                        "Site": facility,
                        "Age Group": ageGroup,
                        "Month": month,
                        "Year": year,
                        "HTS Modality": modality,
                        "HTS Access Type": accessType,
                        "Sex": {
                          "M": "Male",
                          "F": "Female"
                        }[gender],
                        "Result Given": result,
                        "Count": count
                      }

                      res.write(JSON.stringify([
                        {
                          row
                        }
                      ]));

                    } else if (download) {

                      const entry = [
                        district,
                        facility,
                        month,
                        year,
                        modality,
                        accessType,
                        ageGroup,
                        gender,
                        result,
                        count
                      ];

                      json.push(entry.join('\t'));

                    } else if (k >= endPos) {

                      return yCb();

                    }

                    k++;

                    process.nextTick(() => {

                      aCb();

                    });

                  }, (err) => {

                    if (err)
                      console.log(err);

                    process.nextTick(() => {

                      rCb();

                    });

                  });

                }, (err) => {

                  if (err)
                    console.log(err);

                  process.nextTick(() => {

                    gCb();

                  });

                });

              }, (err) => {

                if (err)
                  console.log(err);

                process.nextTick(() => {

                  hCb();

                });

              });

            }, (err) => {

              if (err)
                console.log(err);

              process.nextTick(() => {

                lCb();

              });

            });

          }, (err) => {

            if (err)
              console.log(err);

            process.nextTick(() => {

              mCb();

            });

          });

        }, (err) => {

          if (err)
            console.log(err);

          process.nextTick(() => {

            yCb();

          });

        });

      }, (err) => {

        if (err)
          console.log(err);

        if (download) {

          res.setHeader('Content-disposition', 'attachment; filename=data.csv');
          res.set('Content-Type', 'text/csv');

          res.status(200).send(json.join("\n"));

        } else {

          res.end();

        }

      })

    });

  });

  app.use(router);

};
