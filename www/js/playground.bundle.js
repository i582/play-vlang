var RunCodeResult = /** @class */ (function () {
    function RunCodeResult(output) {
        this.output = output;
    }
    return RunCodeResult;
}());
var FormatCodeResult = /** @class */ (function () {
    function FormatCodeResult() {
    }
    return FormatCodeResult;
}());
var ShareCodeResult = /** @class */ (function () {
    function ShareCodeResult(hash) {
        this.hash = hash;
    }
    return ShareCodeResult;
}());
/**
 * CodeRunner describes how to run, format and share code.
 */
var CodeRunner = /** @class */ (function () {
    function CodeRunner() {
    }
    CodeRunner.runCode = function (code) {
        var data = new FormData();
        data.append("code", code);
        return fetch("/run", {
            method: "post",
            body: data,
        })
            .then(function (resp) {
            if (resp.status != 200) {
                throw new Error("Can't run code");
            }
            return resp.text();
        })
            .then(function (output) { return new RunCodeResult(output); });
    };
    CodeRunner.formatCode = function (code) {
        var data = new FormData();
        data.append("code", code);
        return fetch("/format", {
            method: "post",
            body: data,
        })
            .then(function (resp) { return resp.json(); })
            .then(function (data) { return JSON.parse(data); });
    };
    CodeRunner.shareCode = function (code) {
        var data = new FormData();
        data.append("code", code);
        return fetch("/share", {
            method: "post",
            body: data,
        })
            .then(function (resp) {
            if (resp.status != 200) {
                throw new Error("Can't share code");
            }
            return resp.text();
        })
            .then(function (hash) { return new ShareCodeResult(hash); });
    };
    return CodeRunner;
}());
var Editor = /** @class */ (function () {
    function Editor(wrapper, repository) {
        var _this = this;
        var editorConfig = {
            mode: "v",
            lineNumbers: true,
            matchBrackets: true,
            extraKeys: {
                "Ctrl-Space": "autocomplete",
                "Ctrl-/": "toggleComment",
            },
            indentWithTabs: false,
            indentUnit: 4,
            autoCloseBrackets: true,
            showHint: true,
            lint: {
                async: true,
                lintOnChange: true,
                delay: 20,
            },
            toggleLineComment: {
                indent: true,
                padding: " ",
            },
            theme: "dark",
        };
        this.wrapperElement = wrapper;
        var place = wrapper.querySelector("textarea");
        this.editor = CodeMirror.fromTextArea(place, editorConfig);
        this.repository = repository;
        this.repository.getCode(function (code) {
            _this.setCode(code);
        });
        var terminalElement = wrapper.querySelector(".js-terminal");
        if (terminalElement === null || terminalElement === undefined) {
            throw new Error("Terminal not found, please check that terminal inside editor element");
        }
        this.terminal = new Terminal(terminalElement);
        this.terminal.registerCloseHandler(function () {
            _this.closeTerminal();
            _this.editor.refresh();
        });
        this.terminal.registerWriteHandler(function (_) {
            _this.openTerminal();
        });
        this.terminal.mount();
        this.initFont();
    }
    Editor.prototype.initFont = function () {
        var fontSize = window.localStorage.getItem(Editor.FONT_LOCAL_STORAGE_KEY);
        if (fontSize !== null) {
            this.setEditorFontSize(fontSize);
        }
    };
    Editor.prototype.changeEditorFontSize = function (delta) {
        var cm = document.getElementsByClassName("CodeMirror")[0];
        var fontSize = window.getComputedStyle(cm, null).getPropertyValue("font-size");
        if (fontSize) {
            var newFontSize = parseInt(fontSize) + delta;
            cm.style.fontSize = newFontSize + "px";
            window.localStorage.setItem(Editor.FONT_LOCAL_STORAGE_KEY, newFontSize.toString());
            this.editor.refresh();
        }
    };
    Editor.prototype.setEditorFontSize = function (size) {
        var cm = document.getElementsByClassName("CodeMirror")[0];
        cm.style.fontSize = size + "px";
        this.refresh();
    };
    Editor.prototype.setCode = function (code, preserveCursor) {
        if (preserveCursor === void 0) { preserveCursor = false; }
        var cursor = this.editor.getCursor();
        this.editor.setValue(code);
        this.repository.saveCode(code);
        if (preserveCursor) {
            this.editor.setCursor(cursor);
        }
    };
    Editor.prototype.getCode = function () {
        return this.editor.getValue();
    };
    Editor.prototype.saveCode = function () {
        this.repository.saveCode(this.getCode());
    };
    Editor.prototype.openTerminal = function () {
        this.wrapperElement.classList.remove("closed-terminal");
    };
    Editor.prototype.closeTerminal = function () {
        this.wrapperElement.classList.add("closed-terminal");
    };
    Editor.prototype.setTheme = function (theme) {
        this.editor.setOption("theme", theme.name());
    };
    Editor.prototype.refresh = function () {
        this.editor.refresh();
    };
    Editor.FONT_LOCAL_STORAGE_KEY = "editor-font-size";
    return Editor;
}());
var ExamplesManager = /** @class */ (function () {
    function ExamplesManager() {
        this.onSelectHandler = null;
        this.selectElement = document.querySelector(".js-examples__select");
    }
    ExamplesManager.prototype.registerOnSelectHandler = function (handler) {
        this.onSelectHandler = handler;
    };
    ExamplesManager.prototype.mount = function () {
        var _this = this;
        if (this.selectElement === null || this.selectElement === undefined) {
            return;
        }
        var examplesSelectList = this.selectElement.querySelector(".select-box__list");
        var examplesSelectBox = this.selectElement.querySelector(".select-box__current");
        if (examplesSelectList !== null) {
            examples.forEach(function (example, index) {
                examplesSelectList.innerHTML += ExamplesManager.exampleElementListTemplate(example.name, index);
                examplesSelectBox.innerHTML += ExamplesManager.exampleElementTemplate(example.name, index);
            });
        }
        var selectOptions = this.selectElement.querySelectorAll(".select-box__option");
        selectOptions.forEach(function (option) {
            option.addEventListener("click", function () {
                var exampleName = option.innerText;
                var example = examples.find(function (example) {
                    return example.name === exampleName;
                });
                if (_this.onSelectHandler !== null) {
                    _this.onSelectHandler(example);
                }
            });
        });
    };
    ExamplesManager.exampleElementTemplate = function (name, index) {
        var checked = "";
        if (index === 0) {
            checked = "checked=\"checked\"";
        }
        return "\n<div class=\"select-box__value\">\n    <input class=\"select-box__input\" type=\"radio\" id=\"__select-id-".concat(index, "\" value=\"1\" name=\"Some\" ").concat(checked, "/>\n    <p class=\"select-box__input-text\">").concat(name, "</p>\n</div>\n");
    };
    ExamplesManager.exampleElementListTemplate = function (name, index) {
        return "\n<li>\n    <label class=\"select-box__option\" for=\"__select-id-".concat(index, "\" aria-hidden=\"true\">").concat(name, "</label>\n</li>\n");
    };
    return ExamplesManager;
}());
var examples = [
    {
        name: "Hello, World!",
        code: "\nprintln('Hello, world!')\n",
    },
    {
        name: "Fibonacci",
        code: "\nfn fib(n int) int {\n    mut f := []int{len: n + 2}\n    f[0] = 0\n    f[1] = 1\n    for i := 2; i <= n; i++ {\n        f[i] = f[i - 1] + f[i - 2]\n    }\n    return f[n]\n}\n\nfor i in 0 .. 30 {\n    println(fib(i))\n}\n",
    },
    {
        name: "String interpolation",
        code: "\nareas := ['game', 'web', 'tools', 'science', 'systems', 'embedded', 'drivers', 'GUI', 'mobile']\nfor area in areas {\n    println('Hello, $area developers!')\n}\n",
    },
    {
        name: "JSON Encoding/Decoding",
        code: "\nimport json\n\nstruct User {\n    name string\n    age  int\nmut:\n    is_registered bool\n}\n\nfn main() {\n    s := '[{\"name\":\"Frodo\", \"age\":25}, {\"name\":\"Bobby\", \"age\":10}]'\n    mut users := json.decode([]User, s) or {\n        eprintln('Failed to parse json')\n        return\n    }\n    for user in users {\n        println('$user.name: $user.age')\n    }\n    println('')\n    for i, mut user in users {\n        println('$i) $user.name')\n        if !user.can_register() {\n            println('Cannot register $user.name, they are too young')\n            continue\n        }\n\n        // `user` is declared as `mut` in the for loop,\n        // modifying it will modify the array\n        user.register()\n    }\n\n    // Let's encode users again just for fun\n    println('')\n    println(json.encode(users))\n}\n\nfn (u User) can_register() bool {\n    return u.age >= 16\n}\n\nfn (mut u User) register() {\n    u.is_registered = true\n}\n",
    },
    {
        name: "Filter Log file",
        code: "\n// Print file lines that start with \"DEBUG:\"\nimport os\n\n// `write_file` returns a result (`!`), it must be checked\nos.write_file('app.log', '\nERROR: log file not found\nDEBUG: create new file\nDEBUG: write text to log file\nERROR: file not writeable\n') or {\n    // `err` is a special variable that contains the error\n    // in `or {}` blocks\n    eprintln('failed to write the file: $err')\n    return\n}\n\n// `read_file` returns a result (`!string`), it must be checked\ntext := os.read_file('app.log') or {\n    eprintln('failed to read the file: $err')\n    return\n}\n\nlines := text.split_into_lines()\nfor line in lines {\n    if line.starts_with('DEBUG:') {\n        println(line)\n    }\n}\n\n// DEBUG: create new file\n// DEBUG: write text to log file\n",
    },
    {
        name: "Compile-time Reflection",
        code: "\nstruct User {\n    name string\n    age  int\n}\n\nfn main() {\n    data := 'name=Alice\\nage=18'\n    user := decode&lt;User>(data)\n    println(user)\n}\n\nfn decode&lt;T>(data string) T {\n    mut result := T{}\n    // compile-time `for` loop\n    // T.fields gives an array of a field metadata type\n    $for field in T.fields {\n        $if field.typ is string {\n            // $(string_expr) produces an identifier\n            result.$(field.name) = get_string(data, field.name)\n        } $else $if field.typ is int {\n            result.$(field.name) = get_int(data, field.name)\n        }\n    }\n    return result\n}\n\nfn get_string(data string, field_name string) string {\n    for line in data.split_into_lines() {\n        key_val := line.split('=')\n        if key_val[0] == field_name {\n            return key_val[1]\n        }\n    }\n    return ''\n}\n\nfn get_int(data string, field string) int {\n    return get_string(data, field).int()\n}\n\n// `decode&lt;User>` generates:\n// fn decode_User(data string) User {\n//     mut result := User{}\n//     result.name = get_string(data, 'name')\n//     result.age = get_int(data, 'age')\n//     return result\n// }\n",
    },
].map(function (example) {
    example.code = example.code
        .replaceAll("    ", "    ")
        .replaceAll("&lt;", "<")
        .trim();
    return example;
});
/**
 * CodeRepositoryManager is responsible for managing the code repositories.
 */
var CodeRepositoryManager = /** @class */ (function () {
    function CodeRepositoryManager() {
    }
    /**
     * Base on `params` tries to select the appropriate repository to get the code.
     *
     * @param params The query parameters.
     * @param config The playground configuration.
     * @returns {CodeRepository}
     */
    CodeRepositoryManager.selectRepository = function (params, config) {
        if (config !== undefined && config.codeHash !== null && config.codeHash !== undefined) {
            return new SharedCodeRepository(config.codeHash);
        }
        if (config !== undefined && config.code !== null && config.code !== undefined) {
            return new TextCodeRepository(config.code);
        }
        if (config !== undefined && config.embed !== null && config.embed !== undefined && config.embed) {
            // By default, editor is empty for embed mode.
            return new TextCodeRepository("");
        }
        var repository = new LocalCodeRepository();
        var hash = params.params[SharedCodeRepository.QUERY_PARAM_NAME];
        if (hash !== null && hash !== undefined) {
            return new SharedCodeRepository(hash);
        }
        return repository;
    };
    return CodeRepositoryManager;
}());
/**
 * Local code repository using the browser's local storage.
 */
var LocalCodeRepository = /** @class */ (function () {
    function LocalCodeRepository() {
    }
    LocalCodeRepository.prototype.saveCode = function (code) {
        window.localStorage.setItem(LocalCodeRepository.LOCAL_STORAGE_KEY, code);
    };
    LocalCodeRepository.prototype.getCode = function (onReady) {
        var localCode = window.localStorage.getItem(LocalCodeRepository.LOCAL_STORAGE_KEY);
        if (localCode === null || localCode === undefined) {
            onReady(LocalCodeRepository.WELCOME_CODE);
            return;
        }
        onReady(localCode);
    };
    LocalCodeRepository.LOCAL_STORAGE_KEY = "code";
    LocalCodeRepository.WELCOME_CODE = "\n// Welcome to the V Playground!\n// Here you can edit, run, and share V code.\n// Let's start with a simple \"Hello, World!\" example:\nprintln('Hello, World!')\n\n// More examples are available in right dropdown list.\n// You can find Help for shortcuts in the bottom right corner or just press \u2303 + H (Ctrl + H).\n// See also change theme button in the top right corner. \n// If you want to learn more about V, visit https://vlang.io\n// Enjoy!\n".trim();
    return LocalCodeRepository;
}());
/**
 * Shared code repository using the server side SQL storage.
 */
var SharedCodeRepository = /** @class */ (function () {
    function SharedCodeRepository(hash) {
        this.hash = hash;
    }
    SharedCodeRepository.prototype.saveCode = function (_) {
        // nothing to do
    };
    SharedCodeRepository.prototype.getCode = function (onReady) {
        return this.getSharedCode(onReady);
    };
    SharedCodeRepository.prototype.getSharedCode = function (onReady) {
        var data = new FormData();
        data.append("hash", this.hash);
        fetch("/query", {
            method: "post",
            body: data,
        })
            .then(function (resp) { return resp.text(); })
            .then(function (data) {
            onReady(data);
        })
            .catch(function (err) {
            console.log(err);
        });
    };
    SharedCodeRepository.QUERY_PARAM_NAME = "query";
    return SharedCodeRepository;
}());
var TextCodeRepository = /** @class */ (function () {
    function TextCodeRepository(text) {
        this.text = text;
    }
    TextCodeRepository.prototype.saveCode = function (_) {
    };
    TextCodeRepository.prototype.getCode = function (onReady) {
        onReady(this.text);
    };
    return TextCodeRepository;
}());
var Terminal = /** @class */ (function () {
    function Terminal(element) {
        this.onClose = null;
        this.onWrite = null;
        this.element = element;
    }
    Terminal.prototype.registerCloseHandler = function (handler) {
        this.onClose = handler;
    };
    Terminal.prototype.registerWriteHandler = function (handler) {
        this.onWrite = handler;
    };
    Terminal.prototype.write = function (text) {
        this.getTerminalOutputElement().innerHTML += text + "\n";
        if (this.onWrite !== null) {
            this.onWrite(text);
        }
    };
    Terminal.prototype.clear = function () {
        this.getTerminalOutputElement().innerHTML = "";
    };
    Terminal.prototype.mount = function () {
        var closeButton = this.element.querySelector(".js-terminal__close-buttom");
        if (closeButton === null || closeButton === undefined || this.onClose === null) {
            return;
        }
        closeButton.addEventListener("click", this.onClose);
    };
    Terminal.prototype.getTerminalOutputElement = function () {
        return this.element.querySelector(".js-terminal__output");
    };
    return Terminal;
}());
var Dark = /** @class */ (function () {
    function Dark() {
    }
    Dark.prototype.name = function () {
        return "dark";
    };
    return Dark;
}());
var Light = /** @class */ (function () {
    function Light() {
    }
    Light.prototype.name = function () {
        return "light";
    };
    return Light;
}());
var HelpManager = /** @class */ (function () {
    function HelpManager(containingElement) {
        this.containingElement = containingElement;
        this.element = containingElement.getElementsByClassName("js-help-wrapper")[0];
        if (this.element === null || this.element === undefined) {
            return;
        }
        this.helpOverlay = this.element.getElementsByClassName("js-help-overlay")[0];
        this.showHelpButton = this.element.getElementsByClassName("js-show-help")[0];
        this.closeHelpButton = this.element.getElementsByClassName("js-close-help")[0];
        this.mount();
    }
    HelpManager.prototype.mount = function () {
        var _this = this;
        if (this.showHelpButton !== undefined) {
            this.showHelpButton.addEventListener("click", function () {
                _this.toggleHelp();
            });
        }
        if (this.helpOverlay !== undefined) {
            this.helpOverlay.addEventListener("click", function () {
                _this.toggleHelp();
            });
        }
        if (this.closeHelpButton !== undefined) {
            this.closeHelpButton.addEventListener("click", function () {
                _this.toggleHelp();
            });
        }
        // Replace shortcut with understandable for OS user:
        //  - macOS: ⌃
        //  - Windows/Linux: Ctrl
        if (!HelpManager.isMac) {
            var shortcuts = document.querySelectorAll(".js-shortcut kbd.ctrl");
            shortcuts.forEach(function (shortcut) {
                shortcut.innerText = "Ctrl";
            });
        }
    };
    HelpManager.prototype.closeHelp = function () {
        if (!this.helpOverlay.classList.contains("opened")) {
            return;
        }
        this.toggleHelp();
    };
    HelpManager.prototype.toggleHelp = function () {
        var help = this.containingElement.getElementsByClassName("js-help")[0];
        help.classList.toggle("opened");
        this.helpOverlay.classList.toggle("opened");
    };
    // TODO: don't know other way to detect macOS...
    // noinspection JSDeprecatedSymbols
    HelpManager.isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
    return HelpManager;
}());
/**
 * PlaygroundDefaultAction describes the default action of a playground.
 */
var PlaygroundDefaultAction;
(function (PlaygroundDefaultAction) {
    PlaygroundDefaultAction["RUN"] = "run";
    PlaygroundDefaultAction["FORMAT"] = "format";
    PlaygroundDefaultAction["SHARE"] = "share";
    PlaygroundDefaultAction["CHANGE_THEME"] = "change-theme";
})(PlaygroundDefaultAction || (PlaygroundDefaultAction = {}));
/**
 * Playground is responsible for managing the all playground.
 */
var Playground = /** @class */ (function () {
    /**
     * @param editorElement - The element that will contain the playground.
     */
    function Playground(editorElement) {
        var _this = this;
        this.queryParams = new QueryParams(window.location.search);
        this.repository = CodeRepositoryManager.selectRepository(this.queryParams);
        this.editor = new Editor(editorElement, this.repository);
        this.themeManager = new ThemeManager(this.queryParams);
        this.themeManager.registerOnChange(function (theme) {
            _this.editor.setTheme(theme);
        });
        this.themeManager.loadTheme();
        this.examplesManager = new ExamplesManager();
        this.examplesManager.registerOnSelectHandler(function (example) {
            _this.editor.setCode(example.code);
        });
        this.examplesManager.mount();
        this.helpManager = new HelpManager(editorElement);
    }
    /**
     * Register a handler for the default or new action.
     * @param name - The name of the action.
     * @param callback - The callback to be called when the action is triggered.
     */
    Playground.prototype.registerAction = function (name, callback) {
        var actionButton = document.getElementsByClassName("js-playground__action-".concat(name))[0];
        if (actionButton === undefined) {
            throw new Error("Can't find action button with class js-playground__action-".concat(name));
        }
        actionButton.addEventListener("click", callback);
    };
    Playground.prototype.runCode = function () {
        var _this = this;
        this.clearTerminal();
        this.writeToTerminal("Running code...");
        var code = this.editor.getCode();
        CodeRunner.runCode(code)
            .then(function (result) {
            _this.clearTerminal();
            _this.writeToTerminal(result.output);
        })
            .catch(function (err) {
            console.log(err);
            _this.writeToTerminal("Can't run code. Please try again.");
        });
    };
    Playground.prototype.formatCode = function () {
        var _this = this;
        this.clearTerminal();
        this.writeToTerminal("Formatting code...");
        var code = this.editor.getCode();
        CodeRunner.formatCode(code)
            .then(function (result) {
            if (!result.ok) {
                _this.clearTerminal();
                _this.writeToTerminal(result.output);
                return;
            }
            _this.editor.setCode(result.output, true);
            _this.writeToTerminal("Code formatted successfully!");
        })
            .catch(function (err) {
            console.log(err);
            _this.writeToTerminal("Can't format code. Please try again.");
        });
    };
    Playground.prototype.shareCode = function () {
        var _this = this;
        this.clearTerminal();
        var code = this.editor.getCode();
        CodeRunner.shareCode(code)
            .then(function (result) {
            _this.writeToTerminal("Code shared successfully!");
            _this.queryParams.updateURLParameter(SharedCodeRepository.QUERY_PARAM_NAME, result.hash);
            var link = window.location.href;
            _this.writeToTerminal("Share link: " + link);
            copyTextToClipboard(link, function () {
                _this.writeToTerminal("\nLink copied to clipboard.");
            });
            _this.writeToTerminal("Note: current page has changed its own URL, it now equals the share link shown above.");
        })
            .catch(function (err) {
            console.log(err);
            _this.writeToTerminal("Can't share code. Please try again.");
        });
    };
    Playground.prototype.changeTheme = function () {
        this.themeManager.toggleTheme();
    };
    Playground.prototype.setupShortcuts = function () {
        var _this = this;
        document.addEventListener("keydown", function (ev) {
            _this.editor.saveCode();
            if (ev.ctrlKey && (ev.key === "Enter" || ev.key === "r")) {
                _this.runCode();
                ev.preventDefault();
            }
            if (ev.ctrlKey && ev.key === "l") {
                _this.formatCode();
                ev.preventDefault();
            }
            if (ev.ctrlKey && ev.key === "=") {
                _this.editor.changeEditorFontSize(1);
                ev.preventDefault();
            }
            if (ev.ctrlKey && ev.key === "-") {
                _this.editor.changeEditorFontSize(-1);
                ev.preventDefault();
            }
            if (ev.ctrlKey && ev.key === "h") {
                _this.helpManager.toggleHelp();
                ev.preventDefault();
            }
            if ((ev.ctrlKey || ev.metaKey) && ev.key === "s") {
                _this.repository.saveCode(_this.editor.getCode());
                ev.preventDefault();
            }
            if (ev.key === "Escape") {
                _this.helpManager.closeHelp();
                ev.preventDefault();
            }
        });
    };
    Playground.prototype.clearTerminal = function () {
        this.editor.terminal.clear();
    };
    Playground.prototype.writeToTerminal = function (text) {
        this.editor.terminal.write(text);
    };
    return Playground;
}());
/**
 * QueryParams is responsible for parsing query params from URL
 * and updating the URL when the params change.
 *
 * @example
 * const queryParams = new QueryParams(window.location.search);
 * queryParams.updateURLParameter('theme', 'dark')
 * // The URL will be updated to: http://localhost:8080/?theme=dark
 */
var QueryParams = /** @class */ (function () {
    /**
     * @param path - The path to parse (usually `window.location.search`).
     */
    function QueryParams(path) {
        this.params = new Proxy(new URLSearchParams(path), {
            get: function (searchParams, prop) { return searchParams.get(prop.toString()); },
        });
    }
    /**
     * Update the URL with the new param.
     * @param param The param to update.
     * @param value The new value of the param.
     */
    QueryParams.prototype.updateURLParameter = function (param, value) {
        var url = QueryParams.updateURLParameter(window.location.href, param, value);
        window.history.replaceState({}, "", url);
    };
    QueryParams.updateURLParameter = function (url, param, value) {
        var newAdditionalURL = "";
        var tempArray = url.split("?");
        var baseURL = tempArray[0];
        var additionalURL = tempArray[1];
        var temp = "";
        if (additionalURL) {
            tempArray = additionalURL.split("&");
            for (var i = 0; i < tempArray.length; i++) {
                if (tempArray[i].split("=")[0] !== param) {
                    newAdditionalURL += temp + tempArray[i];
                    temp = "&";
                }
            }
        }
        var rows_txt = temp + "" + param + "=" + value;
        return baseURL + "?" + newAdditionalURL + rows_txt;
    };
    return QueryParams;
}());
function fallbackCopyTextToClipboard(text) {
    var textArea = document.createElement("textarea");
    textArea.value = text;
    // Avoid scrolling to bottom
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
        // noinspection JSDeprecatedSymbols
        var successful = document.execCommand("copy");
        var msg = successful ? "successful" : "unsuccessful";
        console.log("Fallback: Copying text command was " + msg);
    }
    catch (err) {
        console.log("Fallback: Oops, unable to copy", err);
    }
    document.body.removeChild(textArea);
}
function copyTextToClipboard(text, onCopy) {
    if (!navigator.clipboard) {
        fallbackCopyTextToClipboard(text);
        return;
    }
    navigator.clipboard.writeText(text).then(function () {
        console.log("Async: Copying to clipboard was successful!");
        onCopy();
    }, function (err) {
        fallbackCopyTextToClipboard(text);
        console.log("Async: Could not copy text: ", err, "fallback to old method");
    });
}
/**
 * ThemeManager is responsible for managing the theme of the playground.
 * It will register a callback to the change theme button and will update the
 * theme when the user clicks on the button.
 * It will also update the theme when the user changes the theme in the URL.
 *
 * @param queryParams The query params of the URL.
 * @param changeThemeButton The button to change the theme or null.
 *
 * @example
 * const changeThemeButton = document.querySelector('.js-change-theme')
 * const queryParams = new QueryParams(window.location.search);
 * const themeManager = new ThemeManager(queryParams, changeThemeButton)
 *
 * themeManager.registerOnChange((theme) => {
 *   // Do something with the theme
 * })
 */
var ThemeManager = /** @class */ (function () {
    function ThemeManager(queryParams, predefinedTheme) {
        this.themes = [new Dark(), new Light()];
        this.onChange = [];
        this.changeThemeButton = null;
        this.predefinedTheme = null;
        this.fromQueryParam = false;
        this.queryParams = queryParams;
        this.predefinedTheme = predefinedTheme;
        this.changeThemeButton = document.querySelector(".js-playground__action-change-theme");
    }
    ThemeManager.prototype.registerOnChange = function (callback) {
        this.onChange.push(callback);
    };
    ThemeManager.prototype.loadTheme = function () {
        var themeFromQuery = this.queryParams.params[ThemeManager.QUERY_PARAM_NAME];
        if (themeFromQuery !== null && themeFromQuery !== undefined) {
            this.fromQueryParam = true;
            var theme = this.findTheme(themeFromQuery);
            this.turnTheme(theme);
            return;
        }
        var themeFromLocalStorage = window.localStorage.getItem(ThemeManager.LOCAL_STORAGE_KEY);
        if (themeFromLocalStorage !== null && themeFromLocalStorage !== undefined) {
            var theme = this.findTheme(themeFromLocalStorage);
            this.turnTheme(theme);
            return;
        }
        if (this.predefinedTheme !== null && this.predefinedTheme !== undefined) {
            this.turnTheme(this.predefinedTheme);
            return;
        }
        // By default, we turn the dark theme.
        this.turnTheme(new Dark());
    };
    ThemeManager.prototype.findTheme = function (themeFromLocalStorage) {
        var foundThemes = this.themes.filter(function (theme) { return theme.name() === themeFromLocalStorage; });
        var theme = foundThemes[0];
        if (foundThemes.length == 0) {
            theme = new Dark();
        }
        return theme;
    };
    ThemeManager.prototype.turnTheme = function (theme) {
        this.currentTheme = theme;
        this.onChange.forEach(function (callback) { return callback(theme); });
        var icon = moonIcon;
        if (theme.name() === "dark") {
            icon = sunIcon;
        }
        if (this.changeThemeButton !== null) {
            this.changeThemeButton.innerHTML = icon;
        }
        var html = document.querySelector("html");
        html.setAttribute("data-theme", theme.name());
        if (!this.fromQueryParam) {
            // Don't update saved theme state if we're loading from query param.
            window.localStorage.setItem(ThemeManager.LOCAL_STORAGE_KEY, theme.name());
        }
        if (this.fromQueryParam) {
            // We update the query param only if we loaded from it.
            // If we don't change, then the user can change the theme and then reload the page.
            // In this case, the page will load with the theme from the URL, and the user
            // will think that his theme change has not been saved (and will not be saved
            // until he removes the theme from the URL).
            // To avoid this, we update the URL if the user changes theme.
            this.queryParams.updateURLParameter(ThemeManager.QUERY_PARAM_NAME, theme.name());
        }
    };
    ThemeManager.prototype.turnDarkTheme = function () {
        this.turnTheme(new Dark());
    };
    ThemeManager.prototype.turnLightTheme = function () {
        this.turnTheme(new Light());
    };
    ThemeManager.prototype.toggleTheme = function () {
        if (this.currentTheme.name() === "light") {
            this.turnDarkTheme();
        }
        else {
            this.turnLightTheme();
        }
    };
    ThemeManager.QUERY_PARAM_NAME = "theme";
    ThemeManager.LOCAL_STORAGE_KEY = "theme";
    return ThemeManager;
}());
var moonIcon = "<span class=\"icon\">\n<svg class=\"theme-icon\"  width=\"30\" height=\"30\" viewBox=\"0 0 30 30\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M27.1371 20.5912C25.7519 21.0833 24.2605 21.3512 22.7065 21.3512C15.3985 21.3512 9.47424 15.4269 9.47424 8.11889C9.47424 6.10409 9.92454 4.19447 10.73 2.48517C5.60094 4.30725 1.92825 9.20347 1.92825 14.9575C1.92825 22.2655 7.85255 28.1898 15.1605 28.1898C20.4537 28.1898 25.021 25.0818 27.1371 20.5912Z\" fill=\"white\"/>\n</svg>\n</span>\n";
var sunIcon = "<span class=\"icon\">\n<svg class=\"theme-icon\" width=\"30\" height=\"30\" viewBox=\"0 0 30 30\" fill=\"none\"xmlns=\"http://www.w3.org/2000/svg\">\n    <g clip-path=\"url(#clip0_4_47)\">\n    <path d=\"M14.9854 1.92059C14.7382 1.92445 14.5026 2.02624 14.3304 2.20361C14.1581 2.38099 14.0633 2.61946 14.0667 2.86668V5.66668C14.0649 5.79036 14.0878 5.91315 14.1339 6.02792C14.18 6.14269 14.2485 6.24715 14.3353 6.33523C14.4222 6.42331 14.5256 6.49325 14.6398 6.54098C14.7539 6.58872 14.8763 6.61331 15 6.61331C15.1237 6.61331 15.2462 6.58872 15.3603 6.54098C15.4744 6.49325 15.5778 6.42331 15.6647 6.33523C15.7515 6.24715 15.82 6.14269 15.8661 6.02792C15.9122 5.91315 15.9351 5.79036 15.9333 5.66668V2.86668C15.935 2.74181 15.9117 2.61786 15.8646 2.50219C15.8176 2.38651 15.7478 2.28145 15.6594 2.19323C15.571 2.10501 15.4658 2.03542 15.35 1.98859C15.2343 1.94176 15.1103 1.91863 14.9854 1.92059ZM6.41042 5.47892C6.2249 5.47933 6.04372 5.53501 5.88999 5.63885C5.73626 5.7427 5.61696 5.89 5.54732 6.06195C5.47768 6.2339 5.46086 6.4227 5.499 6.60425C5.53714 6.7858 5.62852 6.95187 5.76146 7.08126L7.74115 9.06095C7.82715 9.15052 7.93016 9.22204 8.04415 9.2713C8.15814 9.32056 8.28081 9.34659 8.40498 9.34785C8.52915 9.34912 8.65232 9.32559 8.76728 9.27865C8.88225 9.23172 8.98669 9.16231 9.0745 9.07451C9.1623 8.9867 9.23171 8.88226 9.27864 8.76729C9.32558 8.65233 9.34911 8.52915 9.34784 8.40498C9.34658 8.28081 9.32056 8.15814 9.27129 8.04416C9.22203 7.93017 9.15051 7.82716 9.06094 7.74116L7.08125 5.76147C6.99406 5.67184 6.88975 5.60065 6.77451 5.55211C6.65928 5.50357 6.53546 5.47868 6.41042 5.47892V5.47892ZM23.5604 5.47892C23.3179 5.48614 23.0878 5.58748 22.9188 5.76147L20.9391 7.74116C20.8495 7.82716 20.778 7.93017 20.7287 8.04416C20.6795 8.15814 20.6534 8.28081 20.6522 8.40498C20.6509 8.52915 20.6744 8.65233 20.7214 8.76729C20.7683 8.88225 20.8377 8.9867 20.9255 9.0745C21.0133 9.16231 21.1178 9.23171 21.2327 9.27865C21.3477 9.32558 21.4709 9.34911 21.595 9.34785C21.7192 9.34659 21.8419 9.32056 21.9559 9.2713C22.0698 9.22203 22.1729 9.15052 22.2589 9.06095L24.2385 7.08126C24.3734 6.95016 24.4655 6.78138 24.5028 6.59703C24.5401 6.41268 24.5209 6.22136 24.4476 6.04814C24.3742 5.87493 24.2503 5.7279 24.092 5.62633C23.9337 5.52475 23.7484 5.47337 23.5604 5.47892ZM15 8.46668C13.2673 8.46668 11.6055 9.15501 10.3802 10.3802C9.155 11.6055 8.46667 13.2673 8.46667 15C8.46667 16.7328 9.155 18.3945 10.3802 19.6198C11.6055 20.845 13.2673 21.5333 15 21.5333C16.7328 21.5333 18.3945 20.845 19.6198 19.6198C20.845 18.3945 21.5333 16.7328 21.5333 15C21.5333 13.2673 20.845 11.6055 19.6198 10.3802C18.3945 9.15501 16.7328 8.46668 15 8.46668V8.46668ZM2.86667 14.0667C2.74299 14.0649 2.6202 14.0878 2.50543 14.1339C2.39066 14.18 2.2862 14.2485 2.19812 14.3353C2.11004 14.4222 2.0401 14.5257 1.99237 14.6398C1.94463 14.7539 1.92004 14.8763 1.92004 15C1.92004 15.1237 1.94463 15.2462 1.99237 15.3603C2.0401 15.4744 2.11004 15.5779 2.19812 15.6647C2.2862 15.7515 2.39066 15.82 2.50543 15.8661C2.6202 15.9122 2.74299 15.9351 2.86667 15.9333H5.66667C5.79035 15.9351 5.91314 15.9122 6.02791 15.8661C6.14268 15.82 6.24714 15.7515 6.33522 15.6647C6.4233 15.5779 6.49324 15.4744 6.54098 15.3603C6.58871 15.2462 6.6133 15.1237 6.6133 15C6.6133 14.8763 6.58871 14.7539 6.54098 14.6398C6.49324 14.5257 6.4233 14.4222 6.33522 14.3353C6.24714 14.2485 6.14268 14.18 6.02791 14.1339C5.91314 14.0878 5.79035 14.0649 5.66667 14.0667H2.86667ZM24.3333 14.0667C24.2097 14.0649 24.0869 14.0878 23.9721 14.1339C23.8573 14.18 23.7529 14.2485 23.6648 14.3353C23.5767 14.4222 23.5068 14.5257 23.459 14.6398C23.4113 14.7539 23.3867 14.8763 23.3867 15C23.3867 15.1237 23.4113 15.2462 23.459 15.3603C23.5068 15.4744 23.5767 15.5779 23.6648 15.6647C23.7529 15.7515 23.8573 15.82 23.9721 15.8661C24.0869 15.9122 24.2097 15.9351 24.3333 15.9333H27.1333C27.257 15.9351 27.3798 15.9122 27.4946 15.8661C27.6093 15.82 27.7138 15.7515 27.8019 15.6647C27.89 15.5779 27.9599 15.4744 28.0076 15.3603C28.0554 15.2462 28.08 15.1237 28.08 15C28.08 14.8763 28.0554 14.7539 28.0076 14.6398C27.9599 14.5257 27.89 14.4222 27.8019 14.3353C27.7138 14.2485 27.6093 14.18 27.4946 14.1339C27.3798 14.0878 27.257 14.0649 27.1333 14.0667H24.3333ZM8.38282 20.6565C8.14034 20.6637 7.9102 20.7651 7.74115 20.9391L5.76146 22.9188C5.67189 23.0048 5.60038 23.1078 5.55111 23.2218C5.50185 23.3357 5.47582 23.4584 5.47456 23.5826C5.4733 23.7068 5.49683 23.8299 5.54376 23.9449C5.5907 24.0599 5.6601 24.1643 5.74791 24.2521C5.83572 24.3399 5.94016 24.4093 6.05512 24.4563C6.17009 24.5032 6.29326 24.5267 6.41743 24.5255C6.5416 24.5242 6.66427 24.4982 6.77825 24.4489C6.89224 24.3996 6.99525 24.3281 7.08125 24.2386L9.06094 22.2589C9.19581 22.1278 9.28793 21.959 9.32522 21.7746C9.36252 21.5903 9.34325 21.399 9.26995 21.2257C9.19664 21.0525 9.07272 20.9055 8.91442 20.8039C8.75612 20.7024 8.57082 20.651 8.38282 20.6565ZM21.5898 20.6565C21.4042 20.6566 21.2227 20.712 21.0687 20.8157C20.9147 20.9194 20.7951 21.0667 20.7253 21.2387C20.6554 21.4107 20.6384 21.5997 20.6765 21.7814C20.7146 21.9631 20.806 22.1294 20.9391 22.2589L22.9188 24.2386C23.0048 24.3281 23.1078 24.3996 23.2218 24.4489C23.3357 24.4982 23.4584 24.5242 23.5826 24.5254C23.7067 24.5267 23.8299 24.5032 23.9449 24.4562C24.0598 24.4093 24.1643 24.3399 24.2521 24.2521C24.3399 24.1643 24.4093 24.0599 24.4562 23.9449C24.5032 23.8299 24.5267 23.7068 24.5254 23.5826C24.5242 23.4584 24.4982 23.3357 24.4489 23.2218C24.3996 23.1078 24.3281 23.0048 24.2385 22.9188L22.2589 20.9391C22.1719 20.8497 22.0679 20.7786 21.953 20.7301C21.8381 20.6815 21.7146 20.6565 21.5898 20.6565V20.6565ZM14.9854 23.3873C14.7382 23.3911 14.5026 23.4929 14.3304 23.6703C14.1581 23.8477 14.0633 24.0861 14.0667 24.3333V27.1333C14.0649 27.257 14.0878 27.3798 14.1339 27.4946C14.18 27.6094 14.2485 27.7138 14.3353 27.8019C14.4222 27.89 14.5256 27.9599 14.6398 28.0077C14.7539 28.0554 14.8763 28.08 15 28.08C15.1237 28.08 15.2462 28.0554 15.3603 28.0077C15.4744 27.9599 15.5778 27.89 15.6647 27.8019C15.7515 27.7138 15.82 27.6094 15.8661 27.4946C15.9122 27.3798 15.9351 27.257 15.9333 27.1333V24.3333C15.935 24.2085 15.9117 24.0845 15.8646 23.9689C15.8176 23.8532 15.7478 23.7481 15.6594 23.6599C15.571 23.5717 15.4658 23.5021 15.35 23.4553C15.2343 23.4084 15.1103 23.3853 14.9854 23.3873V23.3873Z\" fill=\"white\"/>\n    </g>\n    <defs>\n    <clipPath id=\"clip0_4_47\">\n    <rect width=\"28\" height=\"28\" fill=\"white\" transform=\"translate(1 1)\"/>\n    </clipPath>\n    </defs>\n</svg>\n</span>\n";
