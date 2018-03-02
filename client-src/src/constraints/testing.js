module.exports.template = {
  "Last HIV Test": {
    "Never Tested": {
      "HIV Rapid Test Outcomes": {
        "First Pass": {
          "Test 1": {
            "Negative": {
              "Outcome Summary": "Single Negative",
              "Result Given to Client": "New Negative",
              "Client Risk Category": {
                "Low Risk": {
                  "Referral for Re-Testing": "No Re-Test needed"
                },
                "On-going Risk": {
                  "Referral for Re-Testing": "Re-Test"
                },
                "High Risk Event in last 3 months": {
                  "Referral for Re-Testing": "Re-Test"
                }
              }
            },
            "Positive": {
              "Test 2": {
                "Positive": {
                  "Under 12 months": {
                    "Outcome Summary": "Test 1 & 2 Positive",
                    "Result Given to Client": "New Exposed Infant",
                    "Referral for Re-Testing": "Confirmatory Test at HIV Clinic"
                  },
                  "12 month or older": {
                    "Outcome Summary": "Test 1 & 2 Positive",
                    "Result Given to Client": "New Positive",
                    "Referral for Re-Testing": "Confirmatory Test at HIV Clinic"
                  }
                },
                "Negative": {
                  "Immediate Repeat": {
                    "Test 1 & 2 Positive": {
                      "Under 12 months": {
                        "Outcome Summary": "Test 1 & 2 Positive",
                        "Result Given to Client": "New Exposed Infant",
                        "Referral for Re-Testing": "Confirmatory Test at HIV Clinic"
                      },
                      "12 month or older": {
                        "Outcome Summary": "Test 1 & 2 Positive",
                        "Result Given to Client": "New Positive",
                        "Referral for Re-Testing": "Confirmatory Test at HIV Clinic"
                      }
                    },
                    "Test 1 & 2 Negative": {
                      "Outcome Summary": "Test 1 & 2 Negative",
                      "Result Given to Client": "New Negative",
                      "Client Risk Category": {
                        "Low Risk": {
                          "Referral for Re-Testing": "No Re-Test needed"
                        },
                        "On-going Risk": {
                          "Referral for Re-Testing": "Re-Test"
                        },
                        "High RiskvEvent in last 3 months": {
                          "Referral for Re-Testing": "Re-Test"
                        }
                      }
                    },
                    "Test 1 & 2 Discordant": {
                      "Outcome Summary": "Test 1 & 2 Discordant",
                      "Result Given to Client": "New Inconclusive",
                      "Referral for Re-Testing": "Re-Test"
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "Last Negative": {
      "HIV Rapid Test Outcomes": {
        "First Pass": {
          "Test 1": {
            "Negative": {
              "Outcome Summary": "Single Negative",
              "Result Given to Client": "New Negative",
              "Client Risk Category": {
                "Low Risk": {
                  "Referral for Re-Testing": "No Re-Test needed"
                },
                "On-going Risk": {
                  "Referral for Re-Testing": "Re-Test"
                },
                "High RiskvEvent in last 3 months": {
                  "Referral for Re-Testing": "Re-Test"
                }
              }
            },
            "Positive": {
              "Test 2": {
                "Positive": {
                  "Under 12 months": {
                    "Outcome Summary": "Test 1 & 2 Positive",
                    "Result Given to Client": "New Exposed Infant",
                    "Referral for Re-Testing": "Confirmatory Test at HIV Clinic"
                  },
                  "12 month or older": {
                    "Outcome Summary": "Test 1 & 2 Positive",
                    "Result Given to Client": "New Positive",
                    "Referral for Re-Testing": "Confirmatory Test at HIV Clinic"
                  }
                },
                "Negative": {
                  "Immediate Repeat": {
                    "Test 1 & 2 Positive": {
                      "Under 12 months": {
                        "Outcome Summary": "Test 1 & 2 Positive",
                        "Result Given to Client": "New Exposed Infant",
                        "Referral for Re-Testing": "Confirmatory Test at HIV Clinic"
                      },
                      "12 month or older": {
                        "Outcome Summary": "Test 1 & 2 Positive",
                        "Result Given to Client": "New Positive",
                        "Referral for Re-Testing": "Confirmatory Test at HIV Clinic"
                      }
                    },
                    "Test 1 & 2 Negative": {
                      "Outcome Summary": "Single Negative",
                      "Result Given to Client": "New Negative",
                      "Client Risk Category": {
                        "Low Risk": {
                          "Referral for Re-Testing": "No Re-Test needed"
                        },
                        "On-going Risk": {
                          "Referral for Re-Testing": "Re-Test"
                        },
                        "High RiskvEvent in last 3 months": {
                          "Referral for Re-Testing": "Re-Test"
                        }
                      }
                    },
                    "Test 1 & 2 Discordant": {
                      "Outcome Summary": "Test 1 & 2 Discordant",
                      "Result Given to Client": "New Inconclusive",
                      "Referral for Re-Testing": "Re-Test"
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "Last Positive": {
      "HIV Rapid Test Outcomes": {
        "First Pass": {
          "Test 1 & 2 Positive": {
            "Under 12 months": {
              "Outcome Summary": "Test 1 & 2 Positive",
              "Result Given to Client": "New Exposed Infant",
              "Referral for Re-Testing": "Confirmatory Test at HIV Clinic"
            },
            "12-23 months": {
              "Outcome Summary": "Test 1 & 2 Positive",
              "Result Given to Client": "Confirmatory Positive",
              "Referral for Re-Testing": "Confirmatory Test at HIV Clinic"
            },
            "2 years +": {
              "Outcome Summary": "Test 1 & 2 Positive",
              "Result Given to Client": "Confirmatory Positive",
              "Referral for Re-Testing": "No Re-Test needed"
            }
          },
          "Test 1 & 2 Negative": {
            "Outcome Summary": "Test 1 & 2 Negative",
            "Result Given to Client": "Confirmatory Inconclusive",
            "Referral for Re-Testing": "Re-Test"
          },
          "Test 1 & 2 Discordant": {
            "Immediate Repeat": {
              "Test 1 & 2 Positive": {
                "Under 12 months": {
                  "Outcome Summary": "Test 1 & 2 Positive",
                  "Result Given to Client": "New Exposed Infant",
                  "Referral for Re-Testing": "Confirmatory Test at HIV Clinic"
                },
                "12-23 months": {
                  "Outcome Summary": "Test 1 & 2 Positive",
                  "Result Given to Client": "Confirmatory Positive",
                  "Referral for Re-Testing": "Confirmatory Test at HIV Clinic"
                },
                "2 years +": {
                  "Outcome Summary": "Test 1 & 2 Positive",
                  "Result Given to Client": "Confirmatory Positive",
                  "Referral for Re-Testing": "No Re-Test needed"
                }
              },
              "Test 1 & 2 Negative": {
                "Outcome Summary": "Test 1 & 2 Negative",
                "Result Given to Client": "Confirmatory Inconclusive",
                "Referral for Re-Testing": "Re-Test"
              },
              "Test 1 & 2 Discordant": {
                "Outcome Summary": "Test 1 & 2 Discordant",
                "Result Given to Client": "Confirmatory Inconclusive",
                "Referral for Re-Testing": "Re-Test"
              }
            }
          }
        }
      }
    },
    "Last Inconclusive": {
      "HIV Rapid Test Outcomes": {
        "First Pass": {
          "Test 1 & 2 Negative": {
            "Outcome Summary": "Test 1 & 2 Negative",
            "Result Given to Client": "New Negative",
            "Client Risk Category": {
              "Low Risk": {
                "Referral for Re-Testing": "No Re-Test needed"
              },
              "On-going Risk": {
                "Referral for Re-Testing": "Re-Test"
              },
              "High RiskvEvent in last 3 months": {
                "Referral for Re-Testing": "Re-Test"
              }
            }
          },
          "Test 1 & 2 Positive": {
            "Under 12 months": {
              "Outcome Summary": "Test 1 & 2 Positive",
              "Result Given to Client": "New Exposed Infant",
              "Referral for Re-Testing": "Confirmatory Test at HIV Clinic"
            },
            "12-23 months": {
              "Outcome Summary": "Test 1 & 2 Positive",
              "Result Given to Client": "New Positive",
              "Referral for Re-Testing": "Confirmatory Test at HIV Clinic"
            },
            "2 years +": {
              "Outcome Summary": "Test 1 & 2 Positive",
              "Result Given to Client": "New Positive",
              "Referral for Re-Testing": "No Re-Test needed"
            }
          },
          "Test 1 & 2 Discordant": {
            "Outcome Summary": "Test 1 & 2 Discordant",
            "Result Given to Client": "Confirmatory Inconclusive",
            "Referral for Re-Testing": "Re-Test"
          }
        }
      }
    }
  }
}
