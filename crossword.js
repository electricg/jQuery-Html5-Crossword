(function($) {
// plugin definition
$.fn.crossword = function(options) {
    var defaults = {
        cross_class     : "crossword",  // class to apply to the table
        td_sel          : "sel",        // class for selected cell
        hor_id          : "hor",        // horizontal definitions id
        ver_id          : "ver",        // vertical definitions id
        tooltip_id      : "tooltip",    // tooltip id
        prefix_id       : "d",          // prefix of the cell id
        pointer         : "pointer",    // class to set cursor pointer
        tooltip_top     : -40,          // tooltip top position
        tooltip_left    : 40            // tooltip left position
    };
    // system variables
    var _hor = "hor",
        _ver = "ver",
        _key_l = 37,    // left
        _key_u = 38,    // up
        _key_r = 39,    // right
        _key_d = 40,    // down
        _key_tab = 9,   // tab
        _key_bks = 8,   // backspace
        _key_del = 46,  // delete
        _key_fst = 65,  // letter 'a' lower/uppercase
        _key_lst = 90,  // letter 'z' lower/uppercase
        _key_spc = 32,  // space
        _rspace = /\s+/,
        D = "#",
        version = "2.1";
    // extend default options with those provided
    var opts = $.extend(defaults, options);

    // implementation code goes here.    
    return this.each(function(){

        var $html = $("html"),
            $body = $("body"),
            $table = $(this),
            $tbody = $table.find("tbody"),
            $defs = $(D + opts.hor_id + "," + D +  opts.ver_id),
            $tooltip = $("<div id='" + opts.tooltip_id + "'></div>"),
            _$input = $tbody.find("input"),
            _$td = $tbody.find("td"),
            _dir = _hor,
            _change_dir = false;

        $table.addClass(opts.cross_class);
        $defs.addClass(opts.pointer);
        $table.after($tooltip);
        $tooltip.easydrag();


        // http://users.wpi.edu/~martin/mod.html
        function mod(a, b) {
            if (b <= 0)
                return(-1);
            else
                return( ((a % b) + b) % b );
        }
        function modPlus(a, b, m) { // Add a and b modulo m
            return( mod( (a % m) + (b % m), m) );
        }
        function modMinus(a, b, m) { // Subtract b from a modulo m
            return( mod( (a % m) - (b % m), m) );
        }


        function selectWord(number, dir, $td) {
            var $word;
            _$td.removeClass(opts.td_sel);
            if (dir != _hor && dir != _ver)
                return false;
            $word = _$td.filter("td[data-" + dir + "='" + opts.prefix_id + number + "'], td[id='" + opts.prefix_id + number + "']");
            _dir = dir;
            // se in questa direzione non c'è una parola
            if ($word.length <= 1) {
                // evidenzio la cella in cui sono
                $td.addClass(opts.td_sel);
                // ritorno un oggetto (o cella) vuoto
                return $();
            }
            $word.addClass(opts.td_sel);
            $first = $word.eq(0);
            return $first;
        }


        function tooltip(number, dir, position) {
            if (position === null) {
                $tooltip.css("display", "");
                return false;
            }
            id = (dir == _hor) ? opts.hor_id : opts.ver_id;
            $def = $defs.filter("[id='" + id + "']").find("[data-def='" + number + "']");
            $tooltip.html($def.html());
            var left = position.left + opts.tooltip_left,
                top = position.top + opts.tooltip_top,
                ow = $html.outerWidth() - $tooltip.outerWidth(),
                oh = $html.outerHeight() - $tooltip.outerHeight();
            // impedisco che finisca fuori dalla finestra
            if (left < 0)
                left = 0;
            else if (left > ow)
                left = ow;
            if (top < 0)
                top = 0;
            else if (top > oh)
                top = oh;
            $tooltip.css("left", left);
            $tooltip.css("top", top);
            $tooltip.css("display", "block");
        }


        // animated automatic scroll to the tooltip
        function scrollTo() {
            var t_top = $tooltip.offset().top,
                t_left = $tooltip.offset().left,
            // the element most top/left between first and tooltip
                off_top = (t_top < first_pos.top) ? t_top : first_pos.top,
                off_left = (t_left < first_pos.left) ? t_left : first_pos.top;
            $html.animate({scrollTop: off_top + "px"}); // IE, FF
            $body.animate({scrollTop: off_top + "px"}); // chrome, safari
            $html.animate({scrollLeft: off_left + "px"}); // IE, FF
            $body.animate({scrollLeft: off_left + "px"}); // chrome, safari
            // Opera scrolls already before because of the focus, so this is a duplicate with a strange effect
        }


        // input focus
        _$input.bind("click focus", function(event, dir) {
            // console.log(event.target+" "+event.type);
            // unisco i due eventi per evitare duplicati
            // e se è un click lo disabilito, disabilitando anche gli altri click sulla tabella
            if (event.type == "click") {
                return false;
            }
            var $input = $(this),
                $td = $input.closest("td"),
                dir = (dir || _dir),
                id = $td.attr("data-" + dir);
            if (!id)
                id = $td.attr("id");
            number = id.replace(opts.prefix_id, "");
            // seleziono il contenuto
            $input.select();
            // evidenzio la parola
            $first = selectWord(number, dir, $td);
            // mostro il tooltip
            first_pos = $first.position()
            tooltip(number, dir, first_pos);
            // mantenere la posizione relativa alla prima lettera fatta col drag&drop
            $tooltip.ondrop(function() {
                var pos = $tooltip.position();
                opts.tooltip_left = pos.left - first_pos.left;
                opts.tooltip_top = pos.top - first_pos.top;
            });
        });


        // definitions click
        $defs.bind("click", function(event) {
            // console.log(event.target+" "+event.type);
            var el = event.target,
                $elem = $(el),
                $ul = $(this),
                $li,
                dir, number,
                position;
            if (el.nodeName === "UL")
                return false;
            else if (el.nodeName === "LI")
                $li = $elem;
            else
                $li = $elem.closest("li");
            dir = ($ul.attr("id") == opts.hor_id) ? _hor : _ver;
            number = parseInt($li.attr("data-def"));
            // focus sulla prima lettera
            $(D + opts.prefix_id + number).find("input").trigger("focus", [dir]);
            // scroll sulla parola/tooltip
            scrollTo();
        });


        // cell click
        $tbody.bind("click", function(event) {
            // console.log(event.target+" "+event.type);
            var el = event.target,
                $elem = $(el);
            if (el.nodeName === "TD") {
                var $input = $elem.find("input");
                if ($input.length) {
                    $input.trigger("focus");
                }
            }
        });


        // input blur
        _$input.bind("blur", function() {
            _$td.removeClass(opts.td_sel);
            $tooltip.css("display", "");
        });


        // for chrome and safari click event
        if (_$input.live) {
            _$input.live("mouseup", function() {
                return false;
            });
        }

        // input keydown
        _$input.bind("keydown", function(event) {
            // console.log(event.target+" "+event.type);
            var key = event.which;
            // console.log(key);
            // exit from this event if not one of the keys
            if (($.inArray(key, [_key_u, _key_r, _key_d, _key_l,
                                _key_tab, _key_bks, _key_del,
                                _key_spc]) == -1) &&
                !(key >= _key_fst && key <= _key_lst)) {
                return false;
            }
            var $input = $(this),
                $td = $input.closest("td"),
                $tbody_child = $tbody.children("tr");
            
            // alfabeto
            if (key >= _key_fst && key <= _key_lst) {
                var $word = _$td.filter(".sel"),
                    i = $word.index($td) + 1;
                $input.val(String.fromCharCode(key));
                $word.eq(i).find("input").trigger("focus");
                return false;
            }
            
            // tasti speciali
            switch (key) {
                // ⇥ tab bar
                case _key_tab:
                    // la prossima cella con id ma senza data-[_dir]
                    var last = ":last-child",
                        $firsts;
                    if (_dir == _hor)
                        $firsts = _$td.filter("[id]").not("[data-" + _dir + "]").not(last);
                    else
                        $firsts = $tbody_child.not(last).find("[id]").not("[data-" + _dir + "]");
                    $firsts = $firsts.add($td);
                    var i = $firsts.index($td) + 1;
                    if (i >= $firsts.length)
                        i = 0;
                    $firsts.eq(i).find("input").trigger("focus");
                    return false;
                    break;
                // backspace
                case _key_bks:
                    if ($input.val()) {
                        $input.val(""); // cancello il suo valore
                    }
                    else {
                        // mi sposto indietro
                        var $word = _$td.filter(".sel"),
                            i = $word.index($td) - 1;
                        // per non tornare alla fine della parola
                        if (i < 0)
                            i = 0;
                        $word.eq(i).find("input").trigger("focus");
                    }
                    return false;
                    break;
                // delete
                case _key_del:
                    $input.val("");
                    return false;
                    break;
                // space
                case _key_spc:
                    _dir = (_dir == _hor) ? _ver : _hor;
                    $input.trigger("focus");
                    return false;
                    break;
            }
            
            // frecce
            var $next,
                $tr = $input.closest("tr"),
                $tr_child = $tr.children(),
                new_tr_i = $tbody_child.index($tr),
                new_td_i = $tr_child.index($td),
                last_tr = $tbody_child.length,
                last_td = $tr_child.length;
            do {
                // order of new_tr_i and new_td_i allocations is important
                switch (key) {
                    // ↑ up
                    case _key_u:
                        new_tr_i = modMinus(new_tr_i, 1, last_tr);
                        new_td_i = modMinus(new_td_i, parseInt(new_tr_i / (last_tr-1)), last_td);
                        break;
                    // → right
                    case _key_r:
                        new_tr_i = modPlus(new_tr_i, parseInt(new_td_i / (last_td-1)), last_tr);
                        new_td_i = modPlus(new_td_i, 1, last_td);
                        break;
                    // ↓ down
                    case _key_d:
                        new_td_i = modPlus(new_td_i, parseInt(new_tr_i / (last_tr-1)), last_td);
                        new_tr_i = modPlus(new_tr_i, 1, last_tr);
                        break;
                    // ← left
                    case _key_l:
                        new_td_i = modMinus(new_td_i, 1, last_td);
                        new_tr_i = modMinus(new_tr_i, parseInt(new_td_i / (last_td-1)), last_tr);
                        break;  
                }
                $next = $tbody_child.eq(new_tr_i).children("td" ).eq(new_td_i).find("input");
            } while ($next.length == 0);
            $next.trigger("focus");
        });

    });
};
// end plugin definition



// plugin definition
$.crosswordCreate = function(options) {
    var defaults = {
        crossword_id    : "crossword",  // table id
        hor_id          : "hor",        // horizontal definitions id
        ver_id          : "ver",        // vertical definitions id
        bb              : "#",          // blackblock, NOT the id simbol !!
        crossword_val   : "",           // value of the schema
        hor_val         : "",           // value of the horizontal definitions
        ver_val         : "",           // value of the vertical definitions
        prefix_id       : "d",          // prefix of the cell id
        caption         : ""            // value of the table caption
    };
    // system variables
    var _hor = "hor",
        _ver = "ver",
        _rspace = /\s+/,
        _rreturn = /[\r\n]/g,
        _rsspace = /[ \t]+/g,
        D = "#",
        version = "2.1";
    // results
    var res = {
        schema  : "",
        def : [] // 0 horizontal, 1 vertical
    };
    // extend default options with those provided
    var opts = $.extend(defaults, options);
    
    // Our plugin implementation code goes here.
    
    // schema
    var hor = [], ver = [],
        c = 0,
        letters,
        rows = $.trim(opts.crossword_val).split(_rspace),
        rows_l = rows.length,
        cols_l = rows[0].length;
    res.schema = "<table id='" + opts.crossword_id + "'>";
    if (opts.caption) {
      res.schema += "<caption>" + opts.caption + "</caption>";  
    }
    res.schema += "<tbody>";
    for (h=0; h<cols_l; h++)
        ver[h] = 0; // posso scrivere
    $.each(rows, function(h, row) {
        if (typeof row === "string" && row != "") {
            hor[h] = 0; // posso scrivere
            res.schema += "<tr>";
            letters = row.split("");
            $.each(letters, function(v, letter) {
                if (letter == opts.bb) {
                    ver[v] = hor[h] = 0;
                    res.schema += "<td></td>";
                }
                else {
                    res.schema += "<td";
                    if (ver[v] || hor[h]) {
                        data1 = hor[h] ? ("data-"+_hor+"='"+opts.prefix_id+hor[h]+"'") : "";
                        data2 = ver[v] ? ("data-"+_ver+"='"+opts.prefix_id+ver[v]+"'") : "";
                        res.schema += " " + $.trim(data1 + " " + data2);
                    }
                    // posso scrivere && non sono sul bordo && non e' una parola di una sola lettera
                    if ((!hor[h] && (v+1)<cols_l && rows[h][v+1]!=opts.bb) ||
                        (!ver[v] && (h+1)<rows_l && rows[h+1][v]!=opts.bb)) {
                        res.schema += " id='" + opts.prefix_id + (++c) + "'";
                        hor[h] = hor[h] || c;
                        ver[v] = ver[v] || c;
                    }
                    res.schema += "><input type='text' maxlength='1' value='' /></td>";
                }
            });
            res.schema += "</tr>";
        }
    });
    res.schema += "</tbody></table>";

    // definitions
    var strings = [opts.hor_val, opts.ver_val],
        ids = [opts.hor_id, opts.ver_id],
        number = 0;
    $.each(strings, function(i, val) {
        rows = $.trim(val).replace(_rsspace, " ").split(_rreturn);
        res.def[i] = "<ul id='" + ids[i] + "'>";
        $.each(rows, function(k, row) {
            row = $.trim(row);
            if (row != "") {
                number = parseInt(row);
                res.def[i] += "<li data-def='" + number + "'><span>" + number + "</span> " + $.trim(row.replace(number, "")) + "</li>";
            }
        });
        res.def[i] += "</ul>";
    });

    return res;
};
// end plugin definition



// plugin definition
$.crosswordCheck = function(options) {
    var defaults = {
        crossword_id    : "crossword",  // table id
        solution        : "",           // solution in a string
        td_err          : "err",        // css class for the error
        bb              : "#",          // blackblock, NOT the id simbol !!
        level           : 1             // type of solution
    };
    // system variables
    var _rspace = /\s+/,
        _rreturn = /[\r\n]/g,
        D = "#",
        version = "2.1";
    // extend default options with those provided
    var opts = $.extend(defaults, options);

    // Our plugin implementation code goes here.
    switch (opts.level) {
        // single letter check
        case 1:
            var solution = $.trim(opts.solution).replace(_rspace, "").replace(_rreturn, "").toUpperCase(),
                griglia = "",
                $cell = $(D + opts.crossword_id + " td");
            $.each($cell, function() {
                griglia += $(this).find("input").val() || opts.bb;
            });
            griglia = griglia.toUpperCase();
            $cell.removeClass(opts.td_err);
            $.each(solution.split(""), function(i, letter) {
                if (letter != griglia[i])
                    $cell.eq(i).addClass(opts.td_err);
            });
            break;

        // word check
        // case 2:
        //     var solution = $.trim(opts.solution).toUpperCase().split(_rreturn),
        //         $cell = $(D + opts.crossword_id + " td");
        //     $cell.addClass(opts.td_err);
        //     console.log(solution);
        //     $.each(solution, function(i, row) {
        //         words = row.split(opts.bb);
        //         $.each(words, function(j, word) {
        //             if (word.length > 1) {}
        //         });
        //     });
        //     break;
        // 
        // default:
        //     break;
    }

    return this;
};
// end plugin definition






})(jQuery);
