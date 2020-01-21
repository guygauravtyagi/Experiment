/*! Copyright (c) 2020 WhatsApp Inc. All Rights Reserved. */ ! function(e) {
    var t = {};

    function r(a) {
        if (t[a]) return t[a].exports;
        var n = t[a] = {
            i: a,
            l: !1,
            exports: {}
        };
        return e[a].call(n.exports, n, n.exports, r), n.l = !0, n.exports
    }
    r.m = e, r.c = t, r.d = function(e, t, a) {
        r.o(e, t) || Object.defineProperty(e, t, {
            configurable: !1,
            enumerable: !0,
            get: a
        })
    }, r.n = function(e) {
        var t = e && e.__esModule ? function() {
            return e.default
        } : function() {
            return e
        };
        return r.d(t, "a", t), t
    }, r.o = function(e, t) {
        return Object.prototype.hasOwnProperty.call(e, t)
    }, r.p = "/", r(r.s = 20)
}([function(e, t, r) {
    "use strict";
    e.exports = {
        REQUEST_STREAMING_INFO: "GET_STREAMING_INFO",
        REQUEST_RMR: "REQUEST_RMR",
        SEND_STREAMING_CHUNK: "SEND_STREAMING_CHUNK",
        EXP_BACKOFF: "EXP_BACKOFF",
        LOG: "LOG",
        UPLOAD_LOGS: "UPLOAD_LOGS",
        REQUEST_DOCUMENT_DOWNLOAD: "REQUEST_DOCUMENT_DOWNLOAD",
        SET_L10N: "SET_L10N",
        STREAMING_SUPPORTED: "STREAMING_SUPPORTED",
        REMOVE_PP: "REMOVE_PP",
        LOGOUT: "LOGOUT",
        CLEAN_ASSETS: "CLEAN_ASSETS",
        PRELOAD_LAZY_LOADED_BUNDLES: "PRELOAD_LAZY_LOADED_BUNDLES"
    }
}, function(e, t, r) {
    "use strict";
    var a = function() {
        function e(e, t) {
            for (var r = 0; r < t.length; r++) {
                var a = t[r];
                a.enumerable = a.enumerable || !1, a.configurable = !0, "value" in a && (a.writable = !0), Object.defineProperty(e, a.key, a)
            }
        }
        return function(t, r, a) {
            return r && e(t.prototype, r), a && e(t, a), t
        }
    }();
    var n = new RegExp(`(${self.registration.scope}|https://web.whatsapp.com/|https://dyn.web.whatsapp.com/)([^?]*)(?:\\?(.*))?`),
        c = function() {
            function e(t, r) {
                ! function(e, t) {
                    if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
                }(this, e), this.matchFetch = function() {
                    return !1
                }, this.matchAction = function() {
                    return !1
                }, this.matchInstall = function() {
                    return !1
                }, this.matchActivate = function() {
                    return !1
                }, this.cache = t, this.store = r
            }
            return a(e, null, [{
                key: "parseUrl",
                value: function(e) {
                    var t = e.match(n);
                    if (t) {
                        var r = void 0;
                        if (t[3]) {
                            var a = {};
                            t[3].split("&").forEach(function(e) {
                                var t = e.split("=");
                                a[t[0]] = t[1]
                            }), r = a
                        }
                        return {
                            base: t[1],
                            relativePath: t[2],
                            queryParams: r
                        }
                    }
                }
            }, {
                key: "convertToUrl",
                value: function(e, t) {
                    var r = Object.keys(t).map(function(e) {
                        return [e, t[e]].map(encodeURIComponent).join("=")
                    }).join("&");
                    return r.length ? e.endsWith("/") ? `${e}?${r}` : `${e}/?${r}` : e
                }
            }]), e
        }();
    c.RequestType = {
        GET: "GET"
    }, e.exports = c
}, function(e, t, r) {
    "use strict";
    var a = function() {
        function e(e, t) {
            for (var r = 0; r < t.length; r++) {
                var a = t[r];
                a.enumerable = a.enumerable || !1, a.configurable = !0, "value" in a && (a.writable = !0), Object.defineProperty(e, a.key, a)
            }
        }
        return function(t, r, a) {
            return r && e(t.prototype, r), a && e(t, a), t
        }
    }();
    var n = function() {
        function e(t) {
            var r = this;
            ! function(e, t) {
                if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
            }(this, e), this.onMessage = function(t) {
                if (t.data && t.data.action) {
                    var a = t.data;
                    if (t.ports && 0 !== t.ports.length) {
                        var n = t.ports;
                        if (e.isSW() || !window.navigator.serviceWorker || t.source === window.navigator.serviceWorker.controller)("function" == typeof t.waitUntil ? function(e) {
                            return t.waitUntil(e)
                        } : function(e) {})(Promise.resolve(r.requestHandler(a)).then(function(e) {
                            n[0].postMessage(e)
                        }).catch(function(e) {
                            n[0].postMessage({
                                error: e && e.toString()
                            })
                        }))
                    }
                }
            }, this.requestHandler = t
        }
        return a(e, [{
            key: "init",
            value: function() {
                var t = e.isSW() ? self : window.navigator.serviceWorker;
                try {
                    if (!t) return;
                    t.addEventListener("message", this.onMessage)
                } catch (e) {}
            }
        }], [{
            key: "isSW",
            value: function() {
                return "undefined" == typeof window
            }
        }, {
            key: "getRequestor",
            value: function(t) {
                return e.isSW() ? "string" == typeof t ? self.clients.get(t) : Promise.resolve(t) : window.navigator.serviceWorker ? window.navigator.serviceWorker.ready.then(function() {
                    return window.navigator.serviceWorker ? window.navigator.serviceWorker.controller : null
                }) : Promise.resolve(null)
            }
        }, {
            key: "broadcast",
            value: function(t, r) {
                if (!e.isSW()) throw new Error("Broadcast called from non-serviceworker.");
                return self.clients.matchAll().then(function(a) {
                    return 0 === a.length ? Promise.reject("No clients available.") : Promise.all(a.map(function(a) {
                        return e.request(a, t, r)
                    }))
                })
            }
        }, {
            key: "request",
            value: function(t, r, a) {
                var n = new MessageChannel;
                return new Promise(function(c, s) {
                    return n.port1.onmessage = function(e) {
                        e.data && e.data.error ? s(e.data.error) : c(e.data)
                    }, e.getRequestor(t).then(function(e) {
                        if (!e) return s("No ServiceWorker controlling this client.");
                        e.postMessage({
                            action: r,
                            message: a,
                            version: "0.4.314"
                        }, [n.port2])
                    })
                })
            }
        }]), e
    }();
    e.exports = n
}, function(e, t, r) {
    "use strict";
    var a = r(2),
        n = r(0),
        c = {
            LOG: "log",
            INFO: "info",
            WARN: "warn",
            ERROR: "error",
            ERROR_VERBOSE: "errorVerbose"
        },
        s = 3,
        o = 1e3,
        i = [],
        f = Promise.resolve(),
        l = void 0;
    var u, d, h, b, p = (u = function() {
        return 0 === i.length ? Promise.resolve() : a.broadcast(n.LOG, {
            buffer: i,
            level: c.LOG,
            message: i
        }).then(function(e) {
            i = []
        }).catch(function() {})
    }, d = 500, h = void 0, b = void 0, function e() {
        if (h) return b = !0, h;
        var t = Array.prototype.slice.call(arguments);
        return h = new Promise(function(r, a) {
            self.setTimeout(function() {
                h = null, b && (r(e.apply(null, t)), b = !1), r()
            }, d)
        }), Promise.resolve(u.apply(null, t))
    });

    function v() {
        for (var e = arguments.length, t = Array(e), r = 0; r < e; r++) t[r] = arguments[r];
        return t.length && i.push({
            level: c.ERROR_VERBOSE,
            message: t
        }), l = l || function e() {
            var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 0;
            return f.then(function() {
                return a.broadcast(n.UPLOAD_LOGS, {
                    buffer: i
                })
            }).catch(function(r) {
                return t < s ? (a = o, new Promise(function(e) {
                    setTimeout(e, a)
                })).then(function() {
                    return e(t + 1)
                }) : Promise.reject("Max generation reached. Failed to upload.");
                var a
            }).then(function(e) {
                return l = void 0, e
            }).catch(function(e) {
                j(`Unable to send upload request, error: ${e}`), l = void 0
            })
        }()
    }

    function j() {
        for (var e = arguments.length, t = Array(e), r = 0; r < e; r++) t[r] = arguments[r];
        y(c.ERROR, t)
    }

    function y(e, t) {
        0 !== t.length && (i.push({
            level: e,
            message: t
        }), f = p())
    }
    self.addEventListener("error", function(e) {
        v(`Global Scope error: ${String(e.error)}, stack: ${e.error?e.error.stack:""}`)
    }), e.exports = {
        log: function() {
            for (var e = arguments.length, t = Array(e), r = 0; r < e; r++) t[r] = arguments[r];
            y(c.LOG, t)
        },
        info: function() {
            for (var e = arguments.length, t = Array(e), r = 0; r < e; r++) t[r] = arguments[r];
            y(c.INFO, t)
        },
        warn: function() {
            for (var e = arguments.length, t = Array(e), r = 0; r < e; r++) t[r] = arguments[r];
            y(c.WARN, t)
        },
        error: j,
        assert: function(e, t, r) {
            j(e, t, r)
        },
        upload: v
    }
}, function(e, t, r) {
    "use strict";
    e.exports = {
        manuallyCloneRequest: function(e, t, r) {
            var a = r;
            return "string" == typeof e ? ((a = a || {}).credentials = "same-origin", new Request(t || e, a)) : new Request(t || e.url, {
                method: void 0 === a.method ? e.method : a.method,
                headers: void 0 === a.headers ? e.headers : a.headers,
                mode: void 0 === a.mode ? e.mode : a.mode,
                credentials: "same-origin",
                cache: void 0 === a.cache ? e.cache : a.cache,
                redirect: void 0 === a.redirect ? e.redirect : a.redirect,
                integrity: void 0 === a.integrity ? e.integrity : a.integrity
            })
        },
        getIndexPath: function(e) {
            return e && e.locale ? `%F0%9F%8C%90/${e.locale}` : ""
        }
    }
}, function(e, t, r) {
    "use strict";
    var a = r(3),
        n = "sw",
        c = 2,
        s = {
            prefs: {},
            pp: {},
            stickers: {}
        },
        o = void 0;

    function i(e) {
        this.storeName = e, this.storeCache = {}
    }
    i.prototype = {
        _callAction(e, t) {
            var r = this;
            return (o || (o = new Promise(function(e, t) {
                var r = self.indexedDB.open(n, c);
                r.onupgradeneeded = function(e) {
                    var t = e.target.result;
                    for (var r in e.target.transaction.onerror = function(e) {
                            a.error(`Unable to upgrade database, error: ${e.target.error}`)
                        }, s) t.objectStoreNames.contains(r) && t.deleteObjectStore(r), t.createObjectStore(r, s[r])
                }, r.onsuccess = function(t) {
                    e(t.target.result)
                }, r.onerror = function(e) {
                    t(e.target.error)
                }
            }).catch(function(e) {
                throw a.error(`Unable to open sw database, error: ${e}`), o = void 0, e
            }))).then(function(a) {
                var n = a.transaction([r.storeName], "readwrite").objectStore(r.storeName),
                    c = n[e].apply(n, t);
                return new Promise(function(e, t) {
                    c.onsuccess = function(t) {
                        e(t.target.result)
                    }, c.onerror = function(e) {
                        t(e.target.error)
                    }
                })
            })
        },
        get(e) {
            var t = this;
            return void 0 !== this.storeCache[e] ? this.storeCache[e] : this.storeCache[e] = this._callAction("get", [e]).catch(function(r) {
                a.error(`Unable to fetch from db, object store: ${t.storeName}, key: ${t.key}, error: ${r}`), t.storeCache[e] = void 0
            })
        },
        put(e, t) {
            var r = this;
            return this.storeCache[e] = Promise.resolve(t), this._callAction("put", [t, e]).catch(function(e) {
                a.error(`Unable to put to db, object store: ${r.storeName}, key: ${r.key}, value: ${r.value}, error: ${e}`)
            })
        },
        delete(e) {
            var t = this;
            return this.storeCache[e] = Promise.resolve(void 0), this._callAction("delete", [e]).catch(function(e) {
                a.error(`Unable to delete in db, object store: ${t.storeName}, key: ${t.key}, error: ${e}`)
            })
        },
        clear() {
            var e = this;
            return this.storeCache = {}, this._callAction("clear").catch(function(t) {
                a.error(`Unable to clear object store: ${e.storeName}, error: ${t}`)
            })
        }
    };
    var f = {
        ObjectStore: i
    };
    for (var l in e.exports = f, s) e.exports[l] = new i(l)
}, function(e, t, r) {
    "use strict";
    Object.defineProperty(t, "__esModule", {
        value: !0
    }), t.default = {
        version: "0.4.314",
        hashedResources: ["app.4d0987d2325194be3e69.js", "app2.b356053d0ae37f612e7b.js", "b8077e03e6bd9320533c.js", "ef760d72fa967da088c1.js", "index.3cc20af85d21d31cf8e8.js", "lazy_loaded_live_location_drawer.f2544612ccafb4a568e4.js", "lazy_loaded_modals.0000f551a2e823ac1a92.js", "lazy_loaded_photo_picker.4fd6968e55caa9a618ef.js", "milan.8869f8fb6221565be57c.js", "opus.80f0850e2d00e90dc79a.js", "pdf.4ce2930cbe825d5e19c1.js", "pdf.worker.f68d33bc85783809112beb1c2070ab16.js", "pdfjsWorker.321538355844e012ca60.js", "progress.88473b135733b681bbbe.js", "svg.289dc68f74e5ce2924eb.js", "vendor1.55ace7f179f4d9937fd3.js", "vendor2.c4844b2c6f89e952d6b0.js", "browsers_40349791179ddc58627213cf8834e36d.css", "cssm_app.09443957a96af8c03ce8d05351b37d86.css", "cssm_qr.589f0535f1d9fa417f1ad7c82e2498b7.css"],
        unhashedResources: ["apple-touch-icon.png", "bryndan_write_20e48b2ec8c64b2a1ceb5b28d9bcc9d0.ttf", "crossdomain.xml", "favicon-48x48.ico", "favicon-64x64.ico", "favicon.ico", "notification_0a598282e94e87dea63e466d115e4a83.mp3", "robots.txt", "sequential-ptt-end_62ed28be622237546fd39f9468a76a49.mp3", "sequential-ptt-middle_7fa161964e93db72b8d00ae22189d75f.mp3", "whatsapp-webclient-login_a0f99e8cbba9eaa747ec23ffb30d63fe.mp4", "whatsapp-webclient-login-hq_10ce945f706bbd216466cd05f672164d.mp4"],
        l10n: {
            locales: {
                "af.e24d45ab01b2b9a20fb6.js": "locales/af.e24d45ab01b2b9a20fb6.js",
                "ar.e02f59da7901321cee33.js": "locales/ar.e02f59da7901321cee33.js",
                "az.0093c04de4681a03e14d.js": "locales/az.0093c04de4681a03e14d.js",
                "bg.40a8c0147d830d5c2210.js": "locales/bg.40a8c0147d830d5c2210.js",
                "bn.837354f91958de49729c.js": "locales/bn.837354f91958de49729c.js",
                "ca.819d813672dae2d1ea4f.js": "locales/ca.819d813672dae2d1ea4f.js",
                "cs.97d0747fd513b9348b13.js": "locales/cs.97d0747fd513b9348b13.js",
                "da.bf9e4a598c4845c5ce11.js": "locales/da.bf9e4a598c4845c5ce11.js",
                "de.ce247bf22283703eb184.js": "locales/de.ce247bf22283703eb184.js",
                "el.81d59888f68e474b98b4.js": "locales/el.81d59888f68e474b98b4.js",
                "en.4e7a288be56157935d73.js": "locales/en.4e7a288be56157935d73.js",
                "es.a4c537e48997dc3b9c78.js": "locales/es.a4c537e48997dc3b9c78.js",
                "et.0662c87fa8949736f87f.js": "locales/et.0662c87fa8949736f87f.js",
                "fa.a5c3f3ca0e5db17a05e0.js": "locales/fa.a5c3f3ca0e5db17a05e0.js",
                "fi.ab0638ff7c9a98fefcfd.js": "locales/fi.ab0638ff7c9a98fefcfd.js",
                "fil.c12a8f1f96cd17f93630.js": "locales/fil.c12a8f1f96cd17f93630.js",
                "fr.6ed80a14d5e5486b9587.js": "locales/fr.6ed80a14d5e5486b9587.js",
                "ga.c697805864c5e91ba49b.js": "locales/ga.c697805864c5e91ba49b.js",
                "gu.5969a352d39251f8c059.js": "locales/gu.5969a352d39251f8c059.js",
                "he.b767d5719b5df3489771.js": "locales/he.b767d5719b5df3489771.js",
                "hi.34634a9efe2f8aa47ce5.js": "locales/hi.34634a9efe2f8aa47ce5.js",
                "hr.603b8d0b55134b5aea27.js": "locales/hr.603b8d0b55134b5aea27.js",
                "hu.9912a579d023440a3771.js": "locales/hu.9912a579d023440a3771.js",
                "id.76a755410bef8022078b.js": "locales/id.76a755410bef8022078b.js",
                "it.8a43a3c7a367931f4340.js": "locales/it.8a43a3c7a367931f4340.js",
                "ja.82514f0ea66e4cc5f010.js": "locales/ja.82514f0ea66e4cc5f010.js",
                "kk.2f2839d0ac7dd0b18202.js": "locales/kk.2f2839d0ac7dd0b18202.js",
                "kn.24f2e2cad42bf0525f44.js": "locales/kn.24f2e2cad42bf0525f44.js",
                "ko.74029c6f65d2e7720748.js": "locales/ko.74029c6f65d2e7720748.js",
                "lt.1bedf06975bd4dbc6d01.js": "locales/lt.1bedf06975bd4dbc6d01.js",
                "lv.43207726cffe7b2c9539.js": "locales/lv.43207726cffe7b2c9539.js",
                "mk.bc39b028f9855cc665c9.js": "locales/mk.bc39b028f9855cc665c9.js",
                "ml.ccaff69cd65231751955.js": "locales/ml.ccaff69cd65231751955.js",
                "mr.095db2809d1cd051b61a.js": "locales/mr.095db2809d1cd051b61a.js",
                "ms.738226ec516c7de3ca89.js": "locales/ms.738226ec516c7de3ca89.js",
                "nb.e43cef8a5c3adea2ffc5.js": "locales/nb.e43cef8a5c3adea2ffc5.js",
                "nl.7e36271e49ab8f4a7933.js": "locales/nl.7e36271e49ab8f4a7933.js",
                "pa.80c7b636db52da54beee.js": "locales/pa.80c7b636db52da54beee.js",
                "pl.d4a4e170e0be407eab70.js": "locales/pl.d4a4e170e0be407eab70.js",
                "pt-BR.ea162ff5e4aadf3a9630.js": "locales/pt-BR.ea162ff5e4aadf3a9630.js",
                "pt.b615a6203356408b9f12.js": "locales/pt.b615a6203356408b9f12.js",
                "ro.03bad3ec31f60c9fb64c.js": "locales/ro.03bad3ec31f60c9fb64c.js",
                "ru.1c3ba38c7b54f6ee5dc1.js": "locales/ru.1c3ba38c7b54f6ee5dc1.js",
                "sk.306c3fa2e4fb362b002c.js": "locales/sk.306c3fa2e4fb362b002c.js",
                "sl.e7fdaf156ffde4188544.js": "locales/sl.e7fdaf156ffde4188544.js",
                "sq.e4294018d125caf5eb53.js": "locales/sq.e4294018d125caf5eb53.js",
                "sr.4fada4b63142a86de8e7.js": "locales/sr.4fada4b63142a86de8e7.js",
                "sv.53e0a57e0648337b8c1f.js": "locales/sv.53e0a57e0648337b8c1f.js",
                "sw.3467eda85d4a5bd5a2bc.js": "locales/sw.3467eda85d4a5bd5a2bc.js",
                "ta.379ef54fb76fb43482f6.js": "locales/ta.379ef54fb76fb43482f6.js",
                "te.94da782b70b0a8ec5c78.js": "locales/te.94da782b70b0a8ec5c78.js",
                "th.4ddc8ccd4409f75d6513.js": "locales/th.4ddc8ccd4409f75d6513.js",
                "tr.8208e88823f951f7b79b.js": "locales/tr.8208e88823f951f7b79b.js",
                "uk.f42ac45c6bdd8147589c.js": "locales/uk.f42ac45c6bdd8147589c.js",
                "ur.adbc90b66a483c07c592.js": "locales/ur.adbc90b66a483c07c592.js",
                "uz.3b0cf06ddb91dfd43b6d.js": "locales/uz.3b0cf06ddb91dfd43b6d.js",
                "vi.f1cbc374ad24fb67343a.js": "locales/vi.f1cbc374ad24fb67343a.js",
                "zh-CN.3fb324a8796c38b0a611.js": "locales/zh-CN.3fb324a8796c38b0a611.js",
                "zh-TW.54b2c550250e0fdbc8af.js": "locales/zh-TW.54b2c550250e0fdbc8af.js"
            },
            styles: {}
        },
        releaseDate: 1579123464553
    }
}, function(e, t, r) {
    "use strict";
    var a, n = r(3);
    a = r(5);
    var c = r(4),
        s = a.prefs,
        o = self.caches.keys(),
        i = /wa\d+\.\d+\.\d+(\.[id])?(\.canary)?$/,
        f = ["wa-pp", "wa-assets", "wa-stickers"];

    function l(e) {
        this.cacheName = e, this.openCachePromise = self.caches.open(this.cacheName)
    }

    function u(e) {
        return e instanceof Request ? e.url : e
    }
    l.prototype = {
        update(e, t) {
            var r = this;
            return function(e) {
                var t = this;
                return o.then(function(t) {
                    var r = t.find(function(t) {
                        return t !== e && i.test(t)
                    });
                    if (r) return new l(r)
                }).catch(function(e) {
                    n.error(`Could not find previous cache, current cache:${t.cacheName}, error: ${e}`)
                })
            }(this.cacheName).then(function(a) {
                if (a) return n.log(`Updating cache: ${r.cacheName}`), s.get("l10n").then(function(n) {
                    return Promise.all(r.prefetchHashedResources(e, a).concat(r.prefetchUnhashedResources(t, n)))
                })
            }).catch(function(e) {
                n.error(`Error occured while updating cache:${r.cacheName}, error: ${e}`)
            })
        },
        prefetchHashedResources(e, t) {
            var r = this;
            return e.map(function(e) {
                var a = self.registration.scope + e;
                return t.match(a).catch(function(e) {
                    n.error(`Unable to match prev. cache, cache name: ${t.cacheName}, request: ${a}, error: ${e}`)
                }).then(function(e) {
                    return e ? r.put(a, e) : r.fetchAndPut(a)
                })
            })
        },
        prefetchUnhashedResources(e, t) {
            var r = this;
            return e.map(function(e) {
                return "" === e ? r.fetchAndPut(self.registration.scope + c.getIndexPath(t), self.registration.scope, {
                    cache: "reload"
                }) : r.fetchAndPut(self.registration.scope + e)
            })
        },
        cleanup() {
            var e = this;
            return o.then(function(t) {
                return Promise.all(t.map(function(t) {
                    if (t !== e.cacheName && !f.includes(t)) return self.caches.delete(t).catch(function(r) {
                        n.error(`Unable to delete cache: ${t}, current cache: ${e.cacheName}, error: ${r}`)
                    })
                }))
            })
        },
        matchOrFetch(e, t, r) {
            var a = this,
                n = t || u(e);
            return this.match(n).then(function(t) {
                return t || a.fetchAndPut(e, n, r)
            })
        },
        fetchAndPut(e, t, r) {
            var a = this,
                s = c.manuallyCloneRequest(e, void 0, {
                    redirect: "manual",
                    mode: "cors"
                });
            return self.fetch(s, r).then(function(r) {
                if (r.ok) {
                    var c = t || u(e);
                    a.put(c, r.clone())
                } else "opaqueredirect" !== r.type && n.error(`Received invalid response, url: ${r.url}, status: ${r.status}, type: ${r.type}`);
                return r
            }).catch(function(t) {
                throw n.error(`Unable to fetch request: ${u(e)}, error: ${t}`), t
            })
        },
        reset() {
            var e = this;
            return this.openCachePromise = self.caches.delete(this.cacheName).then(function() {
                return self.caches.open(e.cacheName)
            })
        },
        match(e, t) {
            var r = this;
            return this.openCachePromise.then(function(r) {
                return r.match(e, t)
            }).catch(function(t) {
                n.error(`Unable to match request: ${u(e)}, in cache: ${r.cacheName}, error: ${t}`)
            })
        },
        put(e, t) {
            var r = this;
            return this.openCachePromise.then(function(r) {
                return r.put(e, t)
            }).catch(function(a) {
                n.error(`Unable to put in cache: ${r.cacheName}, request: ${u(e)}, response status: ${t.status}, err: ${a}`)
            })
        },
        delete(e, t) {
            var r = this;
            return this.openCachePromise.then(function(r) {
                return r.delete(e, t)
            }).catch(function(t) {
                n.error(`Unable to delete request: ${u(e)}, in cache: ${r.cacheName}, error: ${t}`)
            })
        },
        keys(e, t) {
            var r = this;
            return this.openCachePromise.then(function(r) {
                return r.keys(e, t)
            }).catch(function(t) {
                n.error(`Unable to match request: ${u(e)}, in cache: ${r.cacheName}, error: ${t}`)
            })
        }
    }, e.exports = l
}, function(e, t, r) {
    "use strict";
    var a = s(r(0)),
        n = s(r(2)),
        c = s(r(1));

    function s(e) {
        return e && e.__esModule ? e : {
            default: e
        }
    }

    function o(e, t) {
        if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        return !t || "object" != typeof t && "function" != typeof t ? e : t
    }
    var i = "download/blob",
        f = function(e) {
            function t() {
                var e, r, s;
                ! function(e, t) {
                    if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
                }(this, t);
                for (var f = arguments.length, l = Array(f), u = 0; u < f; u++) l[u] = arguments[u];
                return r = s = o(this, (e = t.__proto__ || Object.getPrototypeOf(t)).call.apply(e, [this].concat(l))), s.matchFetch = function(e) {
                    var t = e.request,
                        r = c.default.parseUrl(t.url);
                    return t.method === c.default.RequestType.GET && !!r && !!r.relativePath.match(i)
                }, s.onFetch = function(e) {
                    var t = e.request,
                        r = e.client,
                        s = e.clientId,
                        o = c.default.parseUrl(t.url);
                    if (!o.queryParams || !o.queryParams.msgId) return Promise.reject("Invalid msgId");
                    var i = s || r && r.id;
                    return i ? n.default.request(i, a.default.REQUEST_DOCUMENT_DOWNLOAD, o.queryParams.msgId) : Promise.reject("No client id found.")
                }, o(s, r)
            }
            return function(e, t) {
                if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
                e.prototype = Object.create(t && t.prototype, {
                    constructor: {
                        value: e,
                        enumerable: !1,
                        writable: !0,
                        configurable: !0
                    }
                }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
            }(t, c.default), t
        }();
    e.exports = f
}, function(e, t, r) {
    "use strict";
    var a = function() {
            function e(e, t) {
                for (var r = 0; r < t.length; r++) {
                    var a = t[r];
                    a.enumerable = a.enumerable || !1, a.configurable = !0, "value" in a && (a.writable = !0), Object.defineProperty(e, a.key, a)
                }
            }
            return function(t, r, a) {
                return r && e(t.prototype, r), a && e(t, a), t
            }
        }(),
        n = s(r(0)),
        c = s(r(1));

    function s(e) {
        return e && e.__esModule ? e : {
            default: e
        }
    }

    function o(e, t) {
        if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        return !t || "object" != typeof t && "function" != typeof t ? e : t
    }
    var i = function(e) {
        function t() {
            var e, r, a;
            ! function(e, t) {
                if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
            }(this, t);
            for (var s = arguments.length, i = Array(s), f = 0; f < s; f++) i[f] = arguments[f];
            return r = a = o(this, (e = t.__proto__ || Object.getPrototypeOf(t)).call.apply(e, [this].concat(i))), a.matchFetch = function(e) {
                var t = e.request,
                    r = c.default.parseUrl(t.url);
                return t.method === c.default.RequestType.GET && !!r && ("https://web.whatsapp.com/" === r.base || "https://dyn.web.whatsapp.com/" === r.base) && "pp" === r.relativePath
            }, a.onFetch = function(e) {
                var t = e.request,
                    r = c.default.parseUrl(t.url);
                if (!r || !r.queryParams) return self.fetch(t);
                var n = r.queryParams,
                    s = n.e,
                    o = n.t,
                    i = n.u,
                    f = n.i,
                    l = `${r.base}${r.relativePath}?t=${o}&u=${i}&i=${f}`,
                    u = s ? self.decodeURIComponent(s) : t;
                return a.cache.matchOrFetch(u, l).then(function(e) {
                    return e.ok && a.store.get(i).then(function(e) {
                        if (e !== f) return Promise.all([a.removePPFromCache(i, f), a.store.put(i, f)])
                    }), e
                })
            }, a.matchAction = function(e) {
                return n.default.REMOVE_PP === e || n.default.LOGOUT === e
            }, a.onAction = function(e, t) {
                switch (e) {
                    case n.default.REMOVE_PP:
                        var r = self.encodeURIComponent(t);
                        return a.store.get(r).then(function(e) {
                            if (e) return Promise.all([a.removePPFromCache(r, e), a.store.delete(r)])
                        }).then(function() {});
                    default:
                        return Promise.all([a.cache.reset(), a.store.clear()]).then(function() {})
                }
            }, o(a, r)
        }
        return function(e, t) {
            if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
            e.prototype = Object.create(t && t.prototype, {
                constructor: {
                    value: e,
                    enumerable: !1,
                    writable: !0,
                    configurable: !0
                }
            }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
        }(t, c.default), a(t, [{
            key: "removePPFromCache",
            value: function(e, t) {
                return Promise.all([this.cache.delete(`https://web.whatsapp.com/pp?t=s&u=${e}&i=${t}`), this.cache.delete(`https://web.whatsapp.com/pp?t=l&u=${e}&i=${t}`), this.cache.delete(`https://dyn.web.whatsapp.com/pp?t=s&u=${e}&i=${t}`), this.cache.delete(`https://dyn.web.whatsapp.com/pp?t=l&u=${e}&i=${t}`)])
            }
        }]), t
    }();
    e.exports = i
}, function(e, t, r) {
    "use strict";
    var a = o(r(0)),
        n = o(r(2)),
        c = o(r(1)),
        s = o(r(11));

    function o(e) {
        return e && e.__esModule ? e : {
            default: e
        }
    }

    function i(e, t) {
        if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        return !t || "object" != typeof t && "function" != typeof t ? e : t
    }
    var f = "/stream/video",
        l = function(e) {
            function t() {
                var e, r, o;
                ! function(e, t) {
                    if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
                }(this, t);
                for (var l = arguments.length, u = Array(l), d = 0; d < l; d++) u[d] = arguments[d];
                return r = o = i(this, (e = t.__proto__ || Object.getPrototypeOf(t)).call.apply(e, [this].concat(u))), o.matchFetch = function(e) {
                    var t = e.request,
                        r = c.default.parseUrl(t.url);
                    return !!(t.method === c.default.RequestType.GET && r && r.queryParams && r.queryParams.key && t.url.match(f))
                }, o.onFetch = function(e) {
                    var t = e.request,
                        r = e.client,
                        o = e.clientId,
                        i = c.default.parseUrl(t.url),
                        f = o || r && r.id;
                    return f ? n.default.request(f, a.default.REQUEST_STREAMING_INFO, {
                        key: i.queryParams.key
                    }).then(function(e) {
                        var r = e.cryptoKeys,
                            a = e.streamData;
                        return new s.default(f, r, a).fetchAndDecrypt(t)
                    }) : Promise.reject("No client id found.")
                }, o.matchAction = function(e) {
                    return e === a.default.STREAMING_SUPPORTED
                }, o.onAction = function(e, t) {
                    return !(!self.crypto || !self.crypto.subtle && !self.crypto.webkitSubtle)
                }, i(o, r)
            }
            return function(e, t) {
                if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
                e.prototype = Object.create(t && t.prototype, {
                    constructor: {
                        value: e,
                        enumerable: !1,
                        writable: !0,
                        configurable: !0
                    }
                }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
            }(t, c.default), t
        }();
    e.exports = l
}, function(e, t, r) {
    "use strict";
    var a = function() {
            return function(e, t) {
                if (Array.isArray(e)) return e;
                if (Symbol.iterator in Object(e)) return function(e, t) {
                    var r = [],
                        a = !0,
                        n = !1,
                        c = void 0;
                    try {
                        for (var s, o = e[Symbol.iterator](); !(a = (s = o.next()).done) && (r.push(s.value), !t || r.length !== t); a = !0);
                    } catch (e) {
                        n = !0, c = e
                    } finally {
                        try {
                            !a && o.return && o.return()
                        } finally {
                            if (n) throw c
                        }
                    }
                    return r
                }(e, t);
                throw new TypeError("Invalid attempt to destructure non-iterable instance")
            }
        }(),
        n = function() {
            function e(e, t) {
                for (var r = 0; r < t.length; r++) {
                    var a = t[r];
                    a.enumerable = a.enumerable || !1, a.configurable = !0, "value" in a && (a.writable = !0), Object.defineProperty(e, a.key, a)
                }
            }
            return function(t, r, a) {
                return r && e(t.prototype, r), a && e(t, a), t
            }
        }(),
        c = f(r(0)),
        s = f(r(3)),
        o = f(r(2)),
        i = f(r(4));

    function f(e) {
        return e && e.__esModule ? e : {
            default: e
        }
    }
    var l = 10;

    function u() {
        return self.crypto.subtle || self.crypto.webkitSubtle
    }
    var d = function() {
        function e(t, r, a) {
            ! function(e, t) {
                if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
            }(this, e), this.generation = 0;
            for (var n = r.sidecar, c = [], s = 0; s < n.byteLength; s += l) c.push(n.slice(s, s + l));
            this.cryptoKeys = {
                iv: r.iv,
                sidecar: c,
                encKey: r.encKey,
                macKey: r.macKey
            }, this.streamData = a, this.clientId = t
        }
        return n(e, [{
            key: "fetchAndDecrypt",
            value: function(e) {
                var t = this,
                    r = this.streamData,
                    n = r.clientUrl,
                    i = r.msgKey,
                    f = function(e) {
                        var t = void 0,
                            r = void 0,
                            n = e.headers.get("Range");
                        if (n) {
                            var c = n.replace("bytes=", "").split("-"),
                                s = a(c, 2);
                            t = s[0], r = s[1]
                        } else {
                            var o = new URL(e.url);
                            t = o.searchParams.get("bytesstart"), r = o.searchParams.get("bytesend")
                        }
                        t = parseInt(t, 10) || 0, r = parseInt(r, 10), isNaN(r) && (r = null);
                        return {
                            clientRangeStart: t,
                            clientRangeEnd: r
                        }
                    }(e),
                    l = f.clientRangeStart,
                    u = f.clientRangeEnd,
                    d = this.computeServerRange(l, u),
                    h = d.serverRangeStart,
                    b = d.serverRangeEnd,
                    p = this.createServerRequest(e, h, b, n);
                return fetch(p).then(function(r) {
                    return 404 === r.status ? t.handleRMR(e, i) : r.status >= 400 ? (s.default.log(`sw:videoStreaming:processRequest server returns ${r.status} error`), t.generation++, o.default.request(t.clientId, c.default.EXP_BACKOFF, {
                        generation: t.generation
                    }).then(function() {
                        return t.fetchAndDecrypt(e)
                    })) : (t.generation = 0, r.arrayBuffer().then(function(e) {
                        var a = e.byteLength;
                        return !e || a < 16 ? (s.default.log(`sw:videoStreaming:processRequest ciphertext is too short - ${a} bytes`), new Response(`Ciphertext is too short - ${a} bytes`, {
                            status: 500
                        })) : t.validateSidecar(h, e).then(function() {
                            return t.cleanupCiphertextAndIv(h, e)
                        }).then(function(e) {
                            var r = e.ciphertext,
                                a = e.iv;
                            return t.decrypt(r, a)
                        }).then(function(e) {
                            var a = t.cleanupPlaintext(e, {
                                    clientRangeStart: l,
                                    clientRangeEnd: u
                                }, {
                                    serverRangeStart: h,
                                    serverRangeEnd: b
                                }),
                                n = t.createClientResponse(r, a, l);
                            return t.sendBackArrayBuffer(l, a), n
                        })
                    }))
                })
            }
        }, {
            key: "decrypt",
            value: function(e, t) {
                var r = this.cryptoKeys.encKey,
                    a = {
                        name: "AES-CBC",
                        iv: new Uint8Array(t)
                    };
                return u().importKey("raw", new Uint8Array(r), a, !1, ["decrypt"]).catch(function(e) {
                    throw s.default.log(`sw:videoStreaming:decrypt importKey error: ${String(e)}`), e
                }).then(function(t) {
                    return u().decrypt(a, t, e)
                }).catch(function(e) {
                    throw s.default.log(`sw:videoStreaming:decrypt decrypt error: ${String(e)}`), e
                })
            }
        }, {
            key: "handleRMR",
            value: function(e, t) {
                var r = this;
                return o.default.request(this.clientId, c.default.REQUEST_RMR, {
                    key: t
                }).then(function(t) {
                    return r.cryptoKeys.encKey = t.encKey, r.cryptoKeys.iv = t.iv, r.streamData.clientUrl = t.clientUrl, r.streamData.size = t.size, r.fetchAndDecrypt(e)
                })
            }
        }, {
            key: "cleanupCiphertextAndIv",
            value: function(e, t) {
                var r = this,
                    a = t,
                    n = 0 === e,
                    c = a.byteLength % 16 == 0,
                    s = !c,
                    o = void 0;
                return n ? o = this.cryptoKeys.iv : (o = a.slice(0, 16), a = a.slice(16)), s && (a = a.slice(0, a.byteLength - l)), c ? this.getEncryptedPadding(a).then(function(e) {
                    return {
                        ciphertext: a = r.concatUint8Arrays(new Uint8Array(a), new Uint8Array(e)),
                        iv: o
                    }
                }) : Promise.resolve({
                    ciphertext: a,
                    iv: o
                })
            }
        }, {
            key: "cleanupPlaintext",
            value: function(e, t, r) {
                var a = t.clientRangeStart,
                    n = t.clientRangeEnd,
                    c = r.serverRangeStart,
                    s = r.serverRangeEnd,
                    o = 0 === c ? 0 : a - (c + 16),
                    i = null != n ? s - n : 0;
                return e.slice(o, e.byteLength - i)
            }
        }, {
            key: "getEncryptedPadding",
            value: function(e) {
                var t = this.cryptoKeys.encKey,
                    r = {
                        name: "AES-CBC",
                        iv: e.slice(-16)
                    };
                return u().importKey("raw", new Uint8Array(t), r, !1, ["encrypt"]).catch(function(e) {
                    s.default.log(`sw:videoStreaming:getEncryptedPadding importKey error: ${String(e)}`)
                }).then(function(e) {
                    var t = new Uint8Array([]);
                    return u().encrypt(r, e, t)
                }).catch(function(e) {
                    s.default.log(`sw:videoStreaming:getEncryptedPadding encrypt error: ${String(e)}`)
                })
            }
        }, {
            key: "validateSidecar",
            value: function(e, t) {
                var r = this,
                    a = t,
                    n = this.cryptoKeys,
                    c = n.macKey,
                    s = n.iv,
                    o = n.sidecar,
                    i = void 0,
                    f = void 0;
                0 === e ? (i = 0, f = s) : (i = (e + 16) / 65536, f = a.slice(0, 16), a = a.slice(16));
                var l = a.byteLength / 65536;
                return u().importKey("raw", new Uint8Array(c), {
                    name: "HMAC",
                    hash: {
                        name: "SHA-256"
                    }
                }, !1, ["sign"]).then(function(e) {
                    for (var t = [], n = 0; n < l; n++) {
                        var c = o[i + n],
                            s = 65536 * n,
                            u = a.slice(s, s + 65536),
                            d = f;
                        f = u.slice(65520, 65536);
                        var h = r.concatUint8Arrays(new Uint8Array(d), new Uint8Array(u));
                        t.push(r.validateChunk(h, e, c))
                    }
                    return Promise.all(t)
                })
            }
        }, {
            key: "validateChunk",
            value: function(e, t, r) {
                var a = this;
                return u().sign({
                    name: "HMAC"
                }, t, e).then(function(e) {
                    var t = e.slice(0, l);
                    if (!a.areBuffersEqual(t, r)) return Promise.reject("Invalid Chunk: Does not match sidecar.")
                })
            }
        }, {
            key: "areBuffersEqual",
            value: function(e, t) {
                if (e.byteLength !== t.byteLength) return !1;
                for (var r = new Uint8Array(e), a = new Uint8Array(t), n = 0; n < r.byteLength; n++)
                    if (r[n] !== a[n]) return !1;
                return !0
            }
        }, {
            key: "concatUint8Arrays",
            value: function(e, t) {
                var r = new Uint8Array(e.length + t.length);
                return r.set(e), r.set(t, e.length), r
            }
        }, {
            key: "createClientResponse",
            value: function(e, t, r) {
                var a = this.streamData.size,
                    n = this.getContentRange(r, t),
                    c = `bytes ${n.contentRangeStart}-${n.contentRangeEnd}/${a}`,
                    s = new Headers(e.headers);
                return s.set("Content-Range", c), s.set("Content-Length", `${t.byteLength}`), new Response(t, {
                    status: 200 === e.status ? 206 : e.status,
                    statusText: e.statusText,
                    headers: s
                })
            }
        }, {
            key: "getContentRange",
            value: function(e, t) {
                return {
                    contentRangeStart: e,
                    contentRangeEnd: e + t.byteLength - 1
                }
            }
        }, {
            key: "sendBackArrayBuffer",
            value: function(e, t) {
                var r = this.getContentRange(e, t),
                    a = {
                        start: r.contentRangeStart,
                        end: r.contentRangeEnd,
                        buffer: t
                    };
                o.default.request(this.clientId, c.default.SEND_STREAMING_CHUNK, {
                    msgKey: this.streamData.msgKey,
                    data: a
                })
            }
        }, {
            key: "createServerRequest",
            value: function(e, t, r, a) {
                var n = new URL(a);
                return n.searchParams.set("bytestart", t.toString()), n.searchParams.set("byteend", r.toString()), i.default.manuallyCloneRequest(e, n.toString(), {
                    credentials: "omit",
                    headers: new Headers({}),
                    mode: "cors",
                    referrer: e.referrer
                })
            }
        }, {
            key: "computeServerRange",
            value: function(e, t) {
                var r = e,
                    a = t;
                return r = e ? this.roundDown(e, 65536) : 0, a = null != t && 0 !== t ? this.roundUp(t, 65536) - 1 : r + 1572864 - 1, r > 0 && (r -= 16), {
                    serverRangeStart: r,
                    serverRangeEnd: a
                }
            }
        }, {
            key: "roundUp",
            value: function(e, t) {
                return Math.ceil(e / t) * t
            }
        }, {
            key: "roundDown",
            value: function(e, t) {
                return Math.floor(e / t) * t
            }
        }]), e
    }();
    e.exports = d
}, function(e, t, r) {
    "use strict";
    var a = c(r(0)),
        n = c(r(1));

    function c(e) {
        return e && e.__esModule ? e : {
            default: e
        }
    }

    function s(e, t) {
        if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        return !t || "object" != typeof t && "function" != typeof t ? e : t
    }
    var o = "^img/",
        i = function(e) {
            function t() {
                var e, r, c;
                ! function(e, t) {
                    if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
                }(this, t);
                for (var i = arguments.length, f = Array(i), l = 0; l < i; l++) f[l] = arguments[l];
                return r = c = s(this, (e = t.__proto__ || Object.getPrototypeOf(t)).call.apply(e, [this].concat(f))), c.matchFetch = function(e) {
                    var t = e.request,
                        r = n.default.parseUrl(t.url);
                    return t.method === n.default.RequestType.GET && !!r && r.base === self.registration.scope && !!r.relativePath.match(o)
                }, c.onFetch = function(e) {
                    var t = e.request;
                    return c.cache.matchOrFetch(t).then(function(e) {
                        return e.ok ? e : c.cache.fetchAndPut(t)
                    })
                }, c.matchAction = function(e) {
                    return a.default.CLEAN_ASSETS === e
                }, c.onAction = function(e, t) {
                    var r = new Set(t);
                    return c.cache.keys().then(function(e) {
                        if (e) {
                            var t = [];
                            return e.forEach(function(e) {
                                var a = e.url.lastIndexOf("/") + 1,
                                    n = e.url.slice(a);
                                r.has(n) || t.push(e)
                            }), Promise.all(t.map(function(e) {
                                return c.cache.delete(e)
                            }))
                        }
                    }).then(function() {})
                }, s(c, r)
            }
            return function(e, t) {
                if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
                e.prototype = Object.create(t && t.prototype, {
                    constructor: {
                        value: e,
                        enumerable: !1,
                        writable: !0,
                        configurable: !0
                    }
                }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
            }(t, n.default), t
        }();
    e.exports = i
}, function(e, t, r) {
    "use strict";
    var a, n = r(1),
        c = (a = n) && a.__esModule ? a : {
            default: a
        };

    function s(e, t) {
        if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        return !t || "object" != typeof t && "function" != typeof t ? e : t
    }
    var o = {
            credentials: "include"
        },
        i = function(e) {
            function t() {
                var e, r, a;
                ! function(e, t) {
                    if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
                }(this, t);
                for (var n = arguments.length, i = Array(n), f = 0; f < n; f++) i[f] = arguments[f];
                return r = a = s(this, (e = t.__proto__ || Object.getPrototypeOf(t)).call.apply(e, [this].concat(i))), a.matchFetch = function(e) {
                    var t = e.request,
                        r = c.default.parseUrl(t.url);
                    return t.method === c.default.RequestType.GET && !!r && ("https://web.whatsapp.com/" === r.base || "https://dyn.web.whatsapp.com/" === r.base) && "stickers" === r.relativePath
                }, a.onFetch = function(e) {
                    var t = e.request,
                        r = c.default.parseUrl(t.url);
                    if (!r || !r.queryParams) return self.fetch(t);
                    if (!r.queryParams.u) return self.fetch(t);
                    var n = self.decodeURIComponent(r.queryParams.u),
                        s = `${r.base}${r.relativePath}?u=${n}`;
                    return a.cache.matchOrFetch(n, s).then(function(e) {
                        return e.ok ? e : a.cache.fetchAndPut(t, s, o)
                    })
                }, s(a, r)
            }
            return function(e, t) {
                if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
                e.prototype = Object.create(t && t.prototype, {
                    constructor: {
                        value: e,
                        enumerable: !1,
                        writable: !0,
                        configurable: !0
                    }
                }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
            }(t, c.default), t
        }();
    e.exports = i
}, function(e, t, r) {
    "use strict";
    var a, n = r(15),
        c = r(1),
        s = (a = c) && a.__esModule ? a : {
            default: a
        };

    function o(e, t) {
        if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        return !t || "object" != typeof t && "function" != typeof t ? e : t
    }
    var i = function(e) {
        function t() {
            var e, r, a;
            ! function(e, t) {
                if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
            }(this, t);
            for (var c = arguments.length, i = Array(c), f = 0; f < c; f++) i[f] = arguments[f];
            return r = a = o(this, (e = t.__proto__ || Object.getPrototypeOf(t)).call.apply(e, [this].concat(i))), a.matchFetch = function(e) {
                var t = e.request,
                    r = new URL(t.url),
                    a = new URLSearchParams(r.search);
                return t.method === s.default.RequestType.GET && a.has(n.IS_MMS_URL_SEARCH_PARAM) && (0 === r.pathname.indexOf("/mms/sticker/") || "sticker" === a.get(n.MMS_URL_MEDIA_TYPE_SEARCH_PARAM))
            }, a.onFetch = function(e) {
                return a.cache.matchOrFetch(e.request)
            }, o(a, r)
        }
        return function(e, t) {
            if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
            e.prototype = Object.create(t && t.prototype, {
                constructor: {
                    value: e,
                    enumerable: !1,
                    writable: !0,
                    configurable: !0
                }
            }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
        }(t, s.default), t
    }();
    e.exports = i
}, function(e, t, r) {
    "use strict";
    Object.defineProperty(t, "__esModule", {
        value: !0
    });
    t.IS_MMS_URL_SEARCH_PARAM = "__wa-mms", t.MMS_URL_MEDIA_TYPE_SEARCH_PARAM = "mms-type"
}, function(e, t, r) {
    "use strict";
    var a = s(r(0)),
        n = s(r(6)),
        c = s(r(1));

    function s(e) {
        return e && e.__esModule ? e : {
            default: e
        }
    }

    function o(e, t) {
        if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        return !t || "object" != typeof t && "function" != typeof t ? e : t
    }
    var i = function(e) {
        function t() {
            var e, r, c;
            ! function(e, t) {
                if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
            }(this, t);
            for (var s = arguments.length, i = Array(s), f = 0; f < s; f++) i[f] = arguments[f];
            return r = c = o(this, (e = t.__proto__ || Object.getPrototypeOf(t)).call.apply(e, [this].concat(i))), c.matchAction = function(e) {
                return e === a.default.PRELOAD_LAZY_LOADED_BUNDLES
            }, c.onAction = function(e) {
                return Promise.all(n.default.hashedResources.map(function(e) {
                    return c.cache.matchOrFetch(e)
                })).then(function() {})
            }, o(c, r)
        }
        return function(e, t) {
            if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
            e.prototype = Object.create(t && t.prototype, {
                constructor: {
                    value: e,
                    enumerable: !1,
                    writable: !0,
                    configurable: !0
                }
            }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
        }(t, c.default), t
    }();
    e.exports = i
}, function(e, t, r) {
    "use strict";
    var a, n = r(3),
        c = (a = n) && a.__esModule ? a : {
            default: a
        };
    e.exports = function(e) {
        self.addEventListener("install", function(t) {
            c.default.log("Installing...");
            var r = e.filter(function(e) {
                return e.matchInstall(t)
            }).map(function(e) {
                return Promise.resolve(e.onInstall(t))
            });
            t.waitUntil(Promise.all(r).then(function() {
                return self.skipWaiting()
            }).catch(function(e) {
                c.default.error(`onInstall error: ${String(e)}`)
            }))
        }), self.addEventListener("activate", function(t) {
            c.default.log("Activating...");
            var r = e.filter(function(e) {
                return e.matchActivate(t)
            }).map(function(e) {
                return e.onActivate(t)
            });
            t.waitUntil(self.clients.claim().then(function() {
                return Promise.all(r)
            }).catch(function(e) {
                c.default.error(`onActivate error: ${e}.`)
            }))
        }), self.addEventListener("fetch", function(t) {
            var r = e.find(function(e) {
                return e.matchFetch(t)
            });
            if (r) return t.respondWith(r.onFetch(t))
        }), new(r(2))(function(t) {
            var r = t.action,
                a = t.message,
                n = e.find(function(e) {
                    return e.matchAction(r)
                });
            return n ? n.onAction(r, a) : Promise.reject(`Invalid Action: ${r}`)
        }).init()
    }
}, , , function(e, t, r) {
    "use strict";
    var a, n = r(7);
    a = r(5);
    var c = r(8),
        s = r(9),
        o = r(10),
        i = r(21),
        f = r(12),
        l = r(13),
        u = r(14),
        d = r(16),
        h = new n("wa-stickers"),
        b = [new c, new s(new n("wa-pp"), a.pp), new o, new i(new n("wa0.4.314.canary"), a.prefs), new f(new n("wa-assets")), new l(h, a.stickers), new u(h, a.stickers), new d(new n("wa0.4.314.canary"), a.prefs)];
    r(17)(b)
}, function(e, t, r) {
    "use strict";
    var a = Object.assign || function(e) {
            for (var t = 1; t < arguments.length; t++) {
                var r = arguments[t];
                for (var a in r) Object.prototype.hasOwnProperty.call(r, a) && (e[a] = r[a])
            }
            return e
        },
        n = function() {
            return function(e, t) {
                if (Array.isArray(e)) return e;
                if (Symbol.iterator in Object(e)) return function(e, t) {
                    var r = [],
                        a = !0,
                        n = !1,
                        c = void 0;
                    try {
                        for (var s, o = e[Symbol.iterator](); !(a = (s = o.next()).done) && (r.push(s.value), !t || r.length !== t); a = !0);
                    } catch (e) {
                        n = !0, c = e
                    } finally {
                        try {
                            !a && o.return && o.return()
                        } finally {
                            if (n) throw c
                        }
                    }
                    return r
                }(e, t);
                throw new TypeError("Invalid attempt to destructure non-iterable instance")
            }
        }(),
        c = function() {
            function e(e, t) {
                for (var r = 0; r < t.length; r++) {
                    var a = t[r];
                    a.enumerable = a.enumerable || !1, a.configurable = !0, "value" in a && (a.writable = !0), Object.defineProperty(e, a.key, a)
                }
            }
            return function(t, r, a) {
                return r && e(t.prototype, r), a && e(t, a), t
            }
        }(),
        s = u(r(0)),
        o = u(r(3)),
        i = u(r(6)),
        f = u(r(1)),
        l = u(r(4));

    function u(e) {
        return e && e.__esModule ? e : {
            default: e
        }
    }

    function d(e) {
        if (Array.isArray(e)) {
            for (var t = 0, r = Array(e.length); t < e.length; t++) r[t] = e[t];
            return r
        }
        return Array.from(e)
    }
    var h = "LTR",
        b = "RTL",
        p = /^text\/html/,
        v = function() {
            return {
                version: "0.4.314",
                releaseDate: 0,
                unhashedResources: [],
                hashedResources: [],
                l10n: {
                    styles: {},
                    locales: {}
                }
            }
        },
        j = function(e) {
            function t(e, r) {
                ! function(e, t) {
                    if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
                }(this, t);
                var a = function(e, t) {
                    if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                    return !t || "object" != typeof t && "function" != typeof t ? e : t
                }(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, e, r));
                a.matchInstall = function(e) {
                    return !0
                }, a.onInstall = function(e) {
                    a.store.delete("isCanary").then(function() {
                        return a.fetchIndex(new Request(self.registration.scope))
                    }).then(function() {
                        return Promise.all([a.store.get("isCanary"), a.store.get("l10n")])
                    }).then(function(e) {
                        var t = n(e, 2),
                            r = t[0],
                            c = t[1],
                            s = [].concat(d(a.cacheObject.hashedResources), d(a.cachedL10nHashes(a.cacheObject, c)));
                        r && s.push.apply(s, d(a.betaCacheObject.hashedResources).concat(d(a.cachedL10nHashes(a.betaCacheObject, c))));
                        var o = a.betaCacheObject.unhashedResources.indexOf("");
                        return -1 !== o && a.betaCacheObject.unhashedResources.splice(o, 1), a.cache.update(Array.from(new Set(s)), a.betaCacheObject.unhashedResources)
                    })
                }, a.matchActivate = function(e) {
                    return !0
                }, a.onActivate = function(e) {
                    return a.cache.cleanup()
                }, a.matchFetch = function(e) {
                    var t = e.request,
                        r = f.default.parseUrl(t.url);
                    return t.method === f.default.RequestType.GET && !a.isCacheStale() && !!r && r.base === self.registration.scope && (a.cacheList.has(r.relativePath) || a.betaCacheList.has(r.relativePath) || "" === r.relativePath)
                }, a.onFetch = function(e) {
                    var t = e.request,
                        r = f.default.parseUrl(t.url);
                    return r ? "" === r.relativePath ? a.fetchIndex(t) : a.cache.matchOrFetch(t, `${r.base}${r.relativePath}`) : self.fetch(t)
                }, a.matchAction = function(e) {
                    return e === s.default.SET_L10N
                }, a.onAction = function(e, t) {
                    return Promise.all([a.store.get("isCanary"), a.store.get("l10n")]).then(function(e) {
                        var r = n(e, 2),
                            c = r[0],
                            s = r[1];
                        if (!s || t.locale !== s.locale) {
                            var o = c ? a.betaCacheObject : a.cacheObject,
                                i = a.cachedL10nHashes(o, t),
                                u = n(i, 2),
                                d = u[0],
                                h = u[1];
                            if (!d || !h) return a.store.delete("l10n");
                            var b = c ? {
                                    v: a.betaCacheObject.version
                                } : {},
                                p = f.default.convertToUrl(`${self.registration.scope}${l.default.getIndexPath(t)}`, b);
                            return Promise.all([a.cache.fetchAndPut(p, self.registration.scope), a.store.put("l10n", {
                                locale: t.locale,
                                isRTL: t.isRTL
                            })])
                        }
                    }).then(function() {})
                };
                try {
                    if (a.cacheObject = {
                            version: "0.3.9309",
                            hashedResources: ["app.23ffa35bc714b063c767.js", "app2.725d4d7804a9f4bf45c9.js", "c2e1459b0f7d1f988d21.js", "d1230dad6d0bef4a7fae.js", "emoji.adeb6d8c040426275153.js", "index.1fae9d54d25302ab84e2.js", "lazy_loaded_live_location_drawer.49404a85949d224d9ae7.js", "lazy_loaded_modals.a99d6c48ffeab8d56b6a.js", "lazy_loaded_photo_picker.f64b56cfb71cc6fefadb.js", "milan.ecabf64c9521ab09c891.js", "opus.8eb92fc03afaa19e8577.js", "pdf.84caade57354d606b914.js", "pdf.worker.f68d33bc85783809112beb1c2070ab16.js", "pdfjsWorker.55397a12687c367386fe.js", "progress.4f82b4c3cad0ce459a69.js", "svg.48d7e25d77f5fe0ece1c.js", "vendor1.15d83b58e8c21bb1df8c.js", "vendor2.2f9bc4d78529b23e45d6.js", "browsers_b986a394fb6cfa6d73185d8daf824704.css", "cssm_app.bb72a14fdeec5f541bc0504e3eedfa81.css", "cssm_qr.fb4354ebe6734dbf127be6f5927ae922.css"],
                            unhashedResources: ["apple-touch-icon.png", "bryndan_write_20e48b2ec8c64b2a1ceb5b28d9bcc9d0.ttf", "crossdomain.xml", "favicon-48x48.ico", "favicon-64x64.ico", "favicon.ico", "notification_0a598282e94e87dea63e466d115e4a83.mp3", "robots.txt", "sequential-ptt-end_62ed28be622237546fd39f9468a76a49.mp3", "sequential-ptt-middle_7fa161964e93db72b8d00ae22189d75f.mp3", "whatsapp-webclient-login_a0f99e8cbba9eaa747ec23ffb30d63fe.mp4", "whatsapp-webclient-login-hq_10ce945f706bbd216466cd05f672164d.mp4"],
                            l10n: {
                                locales: {
                                    "af.f11f645f7493ed0ecb34.js": "locales/af.f11f645f7493ed0ecb34.js",
                                    "ar.84c7705a73b8109f8cd9.js": "locales/ar.84c7705a73b8109f8cd9.js",
                                    "az.019cd0e461a25e109d0b.js": "locales/az.019cd0e461a25e109d0b.js",
                                    "bg.78b5153371bb5b053e90.js": "locales/bg.78b5153371bb5b053e90.js",
                                    "bn.1456ef22fa542e22440f.js": "locales/bn.1456ef22fa542e22440f.js",
                                    "ca.ad95e34ec26cf455a9b8.js": "locales/ca.ad95e34ec26cf455a9b8.js",
                                    "cs.fdd80d0aded03293730e.js": "locales/cs.fdd80d0aded03293730e.js",
                                    "da.1ae5de7a7908f06411a8.js": "locales/da.1ae5de7a7908f06411a8.js",
                                    "de.9166ccd332a11ebf0cf0.js": "locales/de.9166ccd332a11ebf0cf0.js",
                                    "el.328b7a6a1753dfc4ff02.js": "locales/el.328b7a6a1753dfc4ff02.js",
                                    "en.4414d53d9dd7127c542d.js": "locales/en.4414d53d9dd7127c542d.js",
                                    "es.e95721e917a21069f1d2.js": "locales/es.e95721e917a21069f1d2.js",
                                    "et.c33f048ae8e9bc1a4b66.js": "locales/et.c33f048ae8e9bc1a4b66.js",
                                    "fa.27f517b66ac494fd26bc.js": "locales/fa.27f517b66ac494fd26bc.js",
                                    "fi.dfb43dd77396a39d56d2.js": "locales/fi.dfb43dd77396a39d56d2.js",
                                    "fil.3de66e6750ec65314634.js": "locales/fil.3de66e6750ec65314634.js",
                                    "fr.9ee56df3812068ebd027.js": "locales/fr.9ee56df3812068ebd027.js",
                                    "ga.5925a362cf6a6ef63ba2.js": "locales/ga.5925a362cf6a6ef63ba2.js",
                                    "gu.c35cd04b71bee4e5691f.js": "locales/gu.c35cd04b71bee4e5691f.js",
                                    "he.707991a1f08cbbd19ba9.js": "locales/he.707991a1f08cbbd19ba9.js",
                                    "hi.60b71b448f39ba102eeb.js": "locales/hi.60b71b448f39ba102eeb.js",
                                    "hr.ade1e83c9b6fe6a730d0.js": "locales/hr.ade1e83c9b6fe6a730d0.js",
                                    "hu.a2bb7fe07743d964a453.js": "locales/hu.a2bb7fe07743d964a453.js",
                                    "id.65c0aff4c6333e2a4b4c.js": "locales/id.65c0aff4c6333e2a4b4c.js",
                                    "it.b7c09be282ca320e9a85.js": "locales/it.b7c09be282ca320e9a85.js",
                                    "ja.0cb3b24f11f3d3450eed.js": "locales/ja.0cb3b24f11f3d3450eed.js",
                                    "kk.d00378e43f025dbb8ee8.js": "locales/kk.d00378e43f025dbb8ee8.js",
                                    "kn.1d70c1781f9a7ee3cb30.js": "locales/kn.1d70c1781f9a7ee3cb30.js",
                                    "ko.1ec33863ab7bd7c5c070.js": "locales/ko.1ec33863ab7bd7c5c070.js",
                                    "lt.0739b303c433407916a8.js": "locales/lt.0739b303c433407916a8.js",
                                    "lv.4ca9ef02cc3e547196a7.js": "locales/lv.4ca9ef02cc3e547196a7.js",
                                    "mk.75e51f99abff15ab35de.js": "locales/mk.75e51f99abff15ab35de.js",
                                    "ml.b23f7d7cfbf29853f502.js": "locales/ml.b23f7d7cfbf29853f502.js",
                                    "mr.dde279b9ac8b38934cae.js": "locales/mr.dde279b9ac8b38934cae.js",
                                    "ms.476413a13d74bb9a82bd.js": "locales/ms.476413a13d74bb9a82bd.js",
                                    "nb.88d9674cbf662b510786.js": "locales/nb.88d9674cbf662b510786.js",
                                    "nl.2acbb43f4871533df37f.js": "locales/nl.2acbb43f4871533df37f.js",
                                    "pa.a506d193e2045a4a76a8.js": "locales/pa.a506d193e2045a4a76a8.js",
                                    "pl.2d40764dcbc931dde12e.js": "locales/pl.2d40764dcbc931dde12e.js",
                                    "pt-BR.20feb9712ee6c0135d8f.js": "locales/pt-BR.20feb9712ee6c0135d8f.js",
                                    "pt.155f62a6a453c93b7a80.js": "locales/pt.155f62a6a453c93b7a80.js",
                                    "ro.f834212a80c23ad3ebb8.js": "locales/ro.f834212a80c23ad3ebb8.js",
                                    "ru.1c039b7aeff77457b5da.js": "locales/ru.1c039b7aeff77457b5da.js",
                                    "sk.a1e8fb2859ee5940a47f.js": "locales/sk.a1e8fb2859ee5940a47f.js",
                                    "sl.e61dea28a4946181628a.js": "locales/sl.e61dea28a4946181628a.js",
                                    "sq.4bdd344e50cf84fb7e31.js": "locales/sq.4bdd344e50cf84fb7e31.js",
                                    "sr.4090795eb832fabd966d.js": "locales/sr.4090795eb832fabd966d.js",
                                    "sv.26e2fae91431d9bfc591.js": "locales/sv.26e2fae91431d9bfc591.js",
                                    "sw.bea77f81a608f7a1ae7e.js": "locales/sw.bea77f81a608f7a1ae7e.js",
                                    "ta.e998d7cddf14472cf7dc.js": "locales/ta.e998d7cddf14472cf7dc.js",
                                    "te.038ff2d77e564a1f4209.js": "locales/te.038ff2d77e564a1f4209.js",
                                    "th.ca6f0ad2d4e3988cee35.js": "locales/th.ca6f0ad2d4e3988cee35.js",
                                    "tr.25fac577686f031e5334.js": "locales/tr.25fac577686f031e5334.js",
                                    "uk.f8dc62c42297238a666b.js": "locales/uk.f8dc62c42297238a666b.js",
                                    "ur.0f16da43d6a376b834b0.js": "locales/ur.0f16da43d6a376b834b0.js",
                                    "uz.6458e5b3b35d64d66f46.js": "locales/uz.6458e5b3b35d64d66f46.js",
                                    "vi.b7a8363e72751fb6946f.js": "locales/vi.b7a8363e72751fb6946f.js",
                                    "zh-CN.21cbf863bae032864b7b.js": "locales/zh-CN.21cbf863bae032864b7b.js",
                                    "zh-TW.c437dd5fa538b0398266.js": "locales/zh-TW.c437dd5fa538b0398266.js"
                                },
                                styles: {}
                            },
                            releaseDate: 1576178658304
                        }, !a.cacheObject.l10n || !a.cacheObject.l10n.styles || !a.cacheObject.l10n.locales) throw new Error("Outdated Cache Schema")
                } catch (e) {
                    a.cacheObject = v(), o.default.error(`Beta serviceworker unable to read current version's cache list: ${e}`)
                }
                return a.betaCacheObject = i.default, a.cacheList = new Set([].concat(d(a.cacheObject.hashedResources), d(a.cacheObject.unhashedResources), d(Object.keys(a.cacheObject.l10n.styles).map(function(e) {
                    return a.cacheObject.l10n.styles[e]
                })), d(Object.keys(a.cacheObject.l10n.locales).map(function(e) {
                    return a.cacheObject.l10n.locales[e]
                })))), a.betaCacheList = new Set([].concat(d(a.betaCacheObject.hashedResources), d(a.betaCacheObject.unhashedResources), d(Object.keys(a.betaCacheObject.l10n.styles).map(function(e) {
                    return a.betaCacheObject.l10n.styles[e]
                })), d(Object.keys(a.betaCacheObject.l10n.locales).map(function(e) {
                    return a.betaCacheObject.l10n.locales[e]
                })))), a
            }
            return function(e, t) {
                if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
                e.prototype = Object.create(t && t.prototype, {
                    constructor: {
                        value: e,
                        enumerable: !1,
                        writable: !0,
                        configurable: !0
                    }
                }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
            }(t, f.default), c(t, [{
                key: "cachedL10nHashes",
                value: function(e) {
                    var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {},
                        r = t.locale,
                        a = t.isRTL ? b : h,
                        n = e.l10n.locales[r],
                        c = e.l10n.styles && e.l10n.styles[a];
                    return n && c ? [n, c] : []
                }
            }, {
                key: "fetchIndex",
                value: function(e) {
                    var t = this,
                        r = f.default.parseUrl(e.url);
                    return Promise.all([this.store.get("isCanary"), this.store.get("l10n")]).then(function(r) {
                        var a = n(r, 2),
                            c = a[0],
                            s = a[1];
                        return c || void 0 === c ? [c, s, null] : t.cache.matchOrFetch(e, self.registration.scope).then(function(e) {
                            var t = p.test(e.headers.get("Content-Type") || "");
                            return [c, s, t ? e : null]
                        })
                    }).then(function(c) {
                        var s = n(c, 3),
                            o = s[0],
                            i = s[1],
                            u = s[2];
                        if (u) return u;
                        var d = a({}, r && r.queryParams || {});
                        (d.force_beta || o) && (d.v = t.betaCacheObject.version);
                        var h = f.default.convertToUrl(`${self.registration.scope}${l.default.getIndexPath(i)}`, d),
                            b = l.default.manuallyCloneRequest(e, h, {
                                mode: "same-origin",
                                redirect: "manual"
                            });
                        return self.fetch(b)
                    }).then(function(e) {
                        return e.ok ? t.determineBeta(e.clone()).then(function() {
                            return e
                        }) : ("opaqueredirect" !== e.type && o.default.error(`Received invalid response, url: ${e.url}, status: ${e.status}, type: ${e.type}`), e)
                    })
                }
            }, {
                key: "determineBeta",
                value: function(e) {
                    var t = this;
                    return e.clone().text().then(function(r) {
                        return t.store.get("isCanary").then(function(a) {
                            if (void 0 === a) {
                                var n = r.includes('x-wa-beta="1"'),
                                    c = [t.store.put("isCanary", n)];
                                return n || c.push(t.cache.put(self.registration.scope, e)), Promise.all(c)
                            }
                        })
                    }).catch(function(e) {
                        o.default.error(`Unable to determine if user was chosen for beta, err:${e}`)
                    })
                }
            }, {
                key: "isCacheStale",
                value: function() {
                    return (new Date).getTime() - this.betaCacheObject.releaseDate >= 6048e5
                }
            }]), t
        }();
    e.exports = j
}]);