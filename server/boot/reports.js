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

  function fetchFNP(field, sMonth, sYear, eMonth, eYear, location, res) {

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
                    gte: (new Date(sYear, sMonth, 1)).format('YYYY-mm-dd'),
                    lte: (new Date(eYear, eMonth, 30)).format('YYYY-mm-dd')
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

  function fetchFP(field, sMonth, sYear, eMonth, eYear, location, res) {

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
                    gte: (new Date(sYear, sMonth, 1)).format('YYYY-mm-dd'),
                    lte: (new Date(eYear, eMonth, 30)).format('YYYY-mm-dd')
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

  function fetchML(field, sMonth, sYear, eMonth, eYear, location, res) {

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
                    gte: (new Date(sYear, sMonth, 1)).format('YYYY-mm-dd'),
                    lte: (new Date(eYear, eMonth, 30)).format('YYYY-mm-dd')
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

  function fetch0to1(field, sMonth, sYear, eMonth, eYear, location, res) {

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
                    gte: (new Date(sYear, sMonth, 1)).format('YYYY-mm-dd'),
                    lte: (new Date(eYear, eMonth, 30)).format('YYYY-mm-dd')
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

  function fetch1to14(field, sMonth, sYear, eMonth, eYear, location, res) {

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
                    gte: (new Date(sYear, sMonth, 1)).format('YYYY-mm-dd'),
                    lte: (new Date(eYear, eMonth, 30)).format('YYYY-mm-dd')
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

  function fetch12to24(field, sMonth, sYear, eMonth, eYear, location, res) {

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
                    gte: (new Date(sYear, sMonth, 1)).format('YYYY-mm-dd'),
                    lte: (new Date(eYear, eMonth, 30)).format('YYYY-mm-dd')
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

  function fetch25plus(field, sMonth, sYear, eMonth, eYear, location, res) {

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
                    gte: (new Date(sYear, sMonth, 1)).format('YYYY-mm-dd'),
                    lte: (new Date(eYear, eMonth, 30)).format('YYYY-mm-dd')
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

  function fetchNT(field, sMonth, sYear, eMonth, eYear, location, res) {

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
                    gte: (new Date(sYear, sMonth, 1)).format('YYYY-mm-dd'),
                    lte: (new Date(eYear, eMonth, 30)).format('YYYY-mm-dd')
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

  function fetchPN(field, sMonth, sYear, eMonth, eYear, location, res) {

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
                    gte: (new Date(sYear, sMonth, 1)).format('YYYY-mm-dd'),
                    lte: (new Date(eYear, eMonth, 30)).format('YYYY-mm-dd')
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

  function fetchPP(field, sMonth, sYear, eMonth, eYear, location, res) {

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
                    gte: (new Date(sYear, sMonth, 1)).format('YYYY-mm-dd'),
                    lte: (new Date(eYear, eMonth, 30)).format('YYYY-mm-dd')
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

  function fetchPEI(field, sMonth, sYear, eMonth, eYear, location, res) {

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
                    gte: (new Date(sYear, sMonth, 1)).format('YYYY-mm-dd'),
                    lte: (new Date(eYear, eMonth, 30)).format('YYYY-mm-dd')
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

  function fetchPI(field, sMonth, sYear, eMonth, eYear, location, res) {

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
                    gte: (new Date(sYear, sMonth, 1)).format('YYYY-mm-dd'),
                    lte: (new Date(eYear, eMonth, 30)).format('YYYY-mm-dd')
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

  function fetchPPr(field, sMonth, sYear, eMonth, eYear, location, res) {

    let args = {
      data: {
        query: {
          bool: {
            must: [
              {
                query_string: {
                  query: 'observation:"Partner Present" AND observationValue:"Yes" AND serviceDeliveryPoin' +
                    't:"' + location + '"'
                }
              }, {
                range: {
                  visitDate: {
                    gte: (new Date(sYear, sMonth, 1)).format('YYYY-mm-dd'),
                    lte: (new Date(eYear, eMonth, 30)).format('YYYY-mm-dd')
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

  function fetchPNP(field, sMonth, sYear, eMonth, eYear, location, res) {

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
                    gte: (new Date(sYear, sMonth, 1)).format('YYYY-mm-dd'),
                    lte: (new Date(eYear, eMonth, 30)).format('YYYY-mm-dd')
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

  function fetchSN(field, sMonth, sYear, eMonth, eYear, location, res) {

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
                    gte: (new Date(sYear, sMonth, 1)).format('YYYY-mm-dd'),
                    lte: (new Date(eYear, eMonth, 30)).format('YYYY-mm-dd')
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

  function fetchSP(field, sMonth, sYear, eMonth, eYear, location, res) {

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
                    gte: (new Date(sYear, sMonth, 1)).format('YYYY-mm-dd'),
                    lte: (new Date(eYear, eMonth, 30)).format('YYYY-mm-dd')
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

  function fetchT12N(field, sMonth, sYear, eMonth, eYear, location, res) {

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
                    gte: (new Date(sYear, sMonth, 1)).format('YYYY-mm-dd'),
                    lte: (new Date(eYear, eMonth, 30)).format('YYYY-mm-dd')
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

  function fetchT12P(field, sMonth, sYear, eMonth, eYear, location, res) {

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
                    gte: (new Date(sYear, sMonth, 1)).format('YYYY-mm-dd'),
                    lte: (new Date(eYear, eMonth, 30)).format('YYYY-mm-dd')
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

  function fetchT12D(field, sMonth, sYear, eMonth, eYear, location, res) {

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
                    gte: (new Date(sYear, sMonth, 1)).format('YYYY-mm-dd'),
                    lte: (new Date(eYear, eMonth, 30)).format('YYYY-mm-dd')
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

  function fetchNN(field, sMonth, sYear, eMonth, eYear, location, res) {

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
                    gte: (new Date(sYear, sMonth, 1)).format('YYYY-mm-dd'),
                    lte: (new Date(eYear, eMonth, 30)).format('YYYY-mm-dd')
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

  function fetchNP(field, sMonth, sYear, eMonth, eYear, location, res) {

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
                    gte: (new Date(sYear, sMonth, 1)).format('YYYY-mm-dd'),
                    lte: (new Date(eYear, eMonth, 30)).format('YYYY-mm-dd')
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

  function fetchNEI(field, sMonth, sYear, eMonth, eYear, location, res) {

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
                    gte: (new Date(sYear, sMonth, 1)).format('YYYY-mm-dd'),
                    lte: (new Date(eYear, eMonth, 30)).format('YYYY-mm-dd')
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

  function fetchNI(field, sMonth, sYear, eMonth, eYear, location, res) {

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
                    gte: (new Date(sYear, sMonth, 1)).format('YYYY-mm-dd'),
                    lte: (new Date(eYear, eMonth, 30)).format('YYYY-mm-dd')
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

  function fetchCP(field, sMonth, sYear, eMonth, eYear, location, res) {

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
                    gte: (new Date(sYear, sMonth, 1)).format('YYYY-mm-dd'),
                    lte: (new Date(eYear, eMonth, 30)).format('YYYY-mm-dd')
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

  function fetchCI(field, sMonth, sYear, eMonth, eYear, location, res) {

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
                    gte: (new Date(sYear, sMonth, 1)).format('YYYY-mm-dd'),
                    lte: (new Date(eYear, eMonth, 30)).format('YYYY-mm-dd')
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

  function fetchPITC(field, sMonth, sYear, eMonth, eYear, location, res) {

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
                    gte: (new Date(sYear, sMonth, 1)).format('YYYY-mm-dd'),
                    lte: (new Date(eYear, eMonth, 30)).format('YYYY-mm-dd')
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

  function fetchFRS(field, sMonth, sYear, eMonth, eYear, location, res) {

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
                    gte: (new Date(sYear, sMonth, 1)).format('YYYY-mm-dd'),
                    lte: (new Date(eYear, eMonth, 30)).format('YYYY-mm-dd')
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

  function fetchOV(field, sMonth, sYear, eMonth, eYear, location, res) {

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
                    gte: (new Date(sYear, sMonth, 1)).format('YYYY-mm-dd'),
                    lte: (new Date(eYear, eMonth, 30)).format('YYYY-mm-dd')
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

  function fetchSS(field, sMonth, sYear, eMonth, eYear, location, res) {

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
                    gte: (new Date(sYear, sMonth, 1)).format('YYYY-mm-dd'),
                    lte: (new Date(eYear, eMonth, 30)).format('YYYY-mm-dd')
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

  function fetchTest1UsedForClients(field, sMonth, sYear, eMonth, eYear, location, res) {

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
                    gte: (new Date(sYear, sMonth, 1)).format('YYYY-mm-dd'),
                    lte: (new Date(eYear, eMonth, 30)).format('YYYY-mm-dd')
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

  function fetchTest2UsedForClients(field, sMonth, sYear, eMonth, eYear, location, res) {

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
                    gte: (new Date(sYear, sMonth, 1)).format('YYYY-mm-dd'),
                    lte: (new Date(eYear, eMonth, 30)).format('YYYY-mm-dd')
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

    const field = decodeURIComponent(query.f);
    const location = decodeURIComponent(query.l);
    const sMonth = decodeURIComponent(query.sm);
    const sYear = decodeURIComponent(query.sy);
    const eMonth = decodeURIComponent(query.em);
    const eYear = decodeURIComponent(query.ey);

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

      concepts[field](field, sMonth, sYear, eMonth, eYear, location, res);

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
    const eMonth = decodeURIComponent(query.em);
    const eYear = decodeURIComponent(query.ey);

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
                    gte: (new Date(sYear, sMonth, 1)).format("YYYY-mm-dd"),
                    lte: (new Date(eYear, eMonth, 30)).format("YYYY-mm-dd")
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
                    lte: (new Date(sYear, sMonth, 30)).format("YYYY-mm-dd")
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
                      lte: (new Date(eYear, eMonth, 30)).format("YYYY-mm-dd")
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

    console.log(group);

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
                    lte: (new Date(year, month, 30))
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

    console.log(JSON.stringify(args));

    (new client()).get(es.protocol + "://" + es.host + ":" + es.port + "/" + es.index + "/pepfar/_search", args, function (result) {

      console.log(result);

      res
        .status(200)
        .json({
          count: (result && result.hits && result.hits.total
            ? result.hits.total
            : 0)
        });

    });

  })

  router.get('/full_disaggregated', function (req, res, next) {

    const url_parts = url.parse(req.url, true);

    const query = url_parts.query;

    if (!fs.existsSync("./data")) {

      fs.mkdirSync("./data");

    }

    const sMonth = decodeURIComponent(query.sm);
    const sYear = decodeURIComponent(query.sy);
    const eMonth = decodeURIComponent(query.em);
    const eYear = decodeURIComponent(query.ey);
    const download = (query.d
      ? true
      : false);
    const csvJSON = (query.j
      ? true
      : false);
    let csv = [];
    let json = [];
    let dump = [];

    if (fs.existsSync(`./data/${sMonth}.${sYear}.${eMonth}.${eYear}.json`)) {

      dump = JSON.parse(fs.readFileSync(`./data/${sMonth}.${sYear}.${eMonth}.${eYear}.json`).toString('utf8'));

    }

    const startPos = (query.s
      ? query.s
      : 0);
    const endPos = (query.e
      ? query.e
      : 20);

    if (dump.length > 0) {

      if (!download && !csvJSON) {

        res.set('Content-Type', 'application/json');

        for (let chunk of dump.splice(startPos, (endPos - startPos))) {

          res.write(JSON.stringify([
            {
              row: chunk
            }
          ]));

        }

        return res.end();

      }

    }

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

    const htsAccessTypeMappings = {
      "PITC": "Routine HTS (PITC) within Health Service",
      "FRS/Index": "Comes with HTS Family Referral Slip",
      "VCT/Other": "Other (VCT, etc.)"
    };

    const htsAccessTypeReverseMappings = {
      "Routine HTS (PITC) within Health Service": "PITC",
      "Comes with HTS Family Referral Slip": "FRS/Index",
      "Other (VCT, etc.)": "VCT/Other"
    };

    const genders = ["M", "F"];

    const resultGivens = ["Negative", "Positive"];

    const facility = site.facility;

    const district = site.location;

    let years = {};

    let period = parseInt((((new Date(eYear, eMonth, 1)) - (new Date(sYear, sMonth, 1))) / (1000 * 60 * 60 * 24 * 30)), 10);

    let trackDate = (new Date(sYear, sMonth, 1));

    for (let i = 0; i <= period; i++) {

      if (!years[trackDate.getFullYear()]) {

        years[trackDate.getFullYear()] = [];

      }

      if (years[trackDate.getFullYear()].indexOf(months[trackDate.getMonth()]) < 0) {

        years[trackDate.getFullYear()].push(months[trackDate.getMonth()]);

      }

      trackDate.setMonth(trackDate.getMonth() + 1);

    }

    let ageGroups = [
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

    if (download) {

      csv.push([
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
      ].join("\t"));

      res.setHeader('Content-disposition', 'attachment; filename=data.csv');
      res.set('Content-Type', 'text/csv');

    } else if (csvJSON) {

      json.push([
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
      ]);

      res.set('Content-Type', 'application/json');

    } else {

      res.set('Content-Type', 'application/json');

    }

    let k = 0;

    async.mapSeries(Object.keys(years), (year, yCb) => {

      async.mapSeries(years[year], (month, mCb) => {

        async.mapSeries(htsModalities, (htsModality, lCb) => {

          async.mapSeries(htsAccessTypes, (htsAccessType, hCb) => {

            async.mapSeries(ageGroups, (ageGroup, aCb) => {

              async.mapSeries(genders, (gender, gCb) => {

                async.mapSeries(resultGivens, (resultGiven, rCb) => {

                  k++;

                  const group = ageGroup.split("-");

                  let args = {
                    data: {
                      query: {
                        bool: {
                          must: [
                            {
                              query_string: {
                                query: (group.length === 1
                                  ? `age:${group[0]}`
                                  : `age:>=${group[0]} AND age:<=${parseFloat(group[1]) + 0.99999}`) + ` AND htsModality:"${htsModality}" AND htsAccessType:"${htsAccessType}" AND gender:"${gender}" AND resultGiven:"${resultGiven}"`
                              }
                            }, {
                              range: {
                                visitDate: {
                                  gte: (new Date(year, months.indexOf(month), 1)).format('YYYY-mm-dd'),
                                  lte: (new Date(year, months.indexOf(month), 30)).format('YYYY-mm-dd')
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

                  (new client()).get(es.protocol + "://" + es.host + ":" + es.port + "/" + es.index + "/pepfar/_search", args, function (result) {

                    const count = (result && result.hits && result.hits.total
                      ? result.hits.total
                      : 0)

                    if (download) {

                      let row = [
                        district,
                        facility,
                        month,
                        year,
                        htsModality,
                        htsAccessType,
                        (group[0] === ">=50"
                          ? "50+"
                          : group.join("-")), {
                            "M": "Male",
                            "F": "Female"
                          }[gender],
                        resultGiven,
                        count
                      ];

                      csv.push(row.join("\t"));

                    } else if (csvJSON) {

                      let row = [
                        district,
                        facility,
                        month,
                        year,
                        htsModality,
                        htsAccessType,
                        (group[0] === ">=50"
                          ? "50+"
                          : group.join("-")), {
                            "M": "Male",
                            "F": "Female"
                          }[gender],
                        resultGiven,
                        count
                      ];

                      json.push(row);

                    } else {

                      let chunk = {
                        "Pos": k,
                        "District": district,
                        "Site": facility,
                        "Age Group": (group[0] === ">=50"
                          ? "50+"
                          : group.join("-")),
                        "Month": month,
                        "Year": year,
                        "HTS Modality": htsModality,
                        "HTS Access Type": htsAccessType,
                        "Sex": {
                          "M": "Male",
                          "F": "Female"
                        }[gender],
                        "Result Given": resultGiven,
                        "Count": count
                      };

                      dump.push(chunk);

                      if (k >= startPos && k <= endPos) {

                        res.write(JSON.stringify([
                          {
                            row: chunk
                          }
                        ]));

                      }

                    }

                    process.nextTick(() => {

                      rCb();

                    })

                  });

                }, (e) => {

                  if (e) {
                    console.log(e);
                  }

                  process.nextTick(() => {

                    gCb();

                  })

                });

              }, (e) => {

                if (e) {
                  console.log(e);
                }

                process.nextTick(() => {

                  aCb();

                });

              });

            }, (e) => {

              if (e) {
                console.log(e);
              }

              process.nextTick(() => {

                hCb();

              });

            });

          }, (e) => {

            if (e) {
              console.log(e);
            }

            process.nextTick(() => {

              lCb();

            });

          });

        }, (e) => {

          if (e) {
            console.log(e);
          }

          process.nextTick(() => {

            mCb();

          });

        });

      }, (e) => {

        if (e) {
          console.log(e);
        }

        process.nextTick(() => {

          yCb();

        });

      });

    }, (e) => {

      if (e) {
        console.log(e);
      }

      if (download) {

        res
          .status(200)
          .send(csv.join("\n"));

      } else if (csvJSON) {

        res
          .status(200)
          .json(json);

      } else {

        fs.writeFileSync(`./data/${sMonth}.${sYear}.${eMonth}.${eYear}.json`, JSON.stringify(dump));

        res.end();

      }

    })

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

  app.use(router);

};
