function typewriter(lines){
    var speed       = 300;
    var line_pause  = 300;
    var index       = 0;
    var text_pos    = 0;
    var line_length = lines[0].length;
    var contents    = '';
    var row         = 0;
  
    return function (){
        
        var bdy         = document.body;
        bdy.innerHTML   = contents + lines[index].substring(0,text_pos) + "_";

        if(text_pos++ == line_length){

            text_pos = 0;
            index++;
            if(index != lines.length){
                line_length = lines[index].length;
                setTimeout(arguments.callee, line_pause);
            }
            contents += lines[row++] + '<br />';
        }else {
            setTimeout(arguments.callee, speed);
        }
        //bdy.scrollTop   = bdy.scrollHeight;
        window.scrollTo(0, document.body.scrollHeight);
    }
}

function type_recruitment(){
    var lines = new Array(
        '<pre>/*',
        ' * @(#) recruitmentImpl.java            1.0.0 04/10/2015',
        ' *',
        ' * Copyleft 2013-2015 the original author or authors',
        ' * Licensed under the ..., eeennnnnnnnnn, whatever!',
        ' */',
        '',
        '/**',
        ' * 人才啊人才,快到我的碗里来~~~',
        ' * @hr   John Chern &lt;<a href="mailto:johnchern@163.com">johnchern@163.com</a>&gt;',
        ' * @corp 泰安云图软件有限公司',
        ' * @tel  <a href="tel:+86.18653895778">+86.18653895778</a>',
        ' */',
        '//public class recruitmentImpl implements recruitment {',
        'public class recruitmentImpl {',
        '',
        '    /** 这年头,没个口号怎么能显的高大上! */',
        '    private static final String slogan = ',
        '        "你是否厌倦了雾霾,拥挤和房价高企?\\n"',
        '        + "你是否还有想做点儿事情的冲动?\\n"',
        '        + "Come on, Join us!\\n"',
        '        + "泰山脚下,美丽小城,尽情挥洒!\\n"',
        '        + "我们求贤若渴,我们需要以下人才:\\n"; ',
        '',
        '    /** 如果能满足以下要求最好:-) */',
        '    private static final String[] requisites = {',
        '            "后端攻城狮\\n"',
        '            + "\t1. 英语水平较高,有较强的自学能力,热爱软件开发,乐于钻研新技术\\n"',
        '            + "\t2. 精通Spring MVC + Spring IoC + MyBatis开发技术\\n"',
        '            + "\t3. 熟悉git版本控制系统\\n"',
        '            + "\t4. 熟悉linux系统及shell编程,熟悉python,热爱opensource优先\\n"',
        '            + "\t5. 全日制本科或以上学历,计算机相关专业优先\\n"',
        '            + "\t6. 2年以上工作经验\\n",',
        '            "前端攻城狮\\n"',
        '            + "\t1. 英语水平较高,有较强的自学能力,热爱软件开发,乐于钻研新技术\\n"',
        '            + "\t2. 精通javascript/html5/css3/AJAX技术,熟悉json数据格式\\n"',
        '            + "\t3. 熟悉git版本控制系统\\n"',
        '            + "\t4. 熟练使用jQuery等常见js框架,熟悉js前端MV*框架优先\\n"',
        '            + "\t5. 全日制本科或以上学历,计算机相关专业优先\\n"',
        '            + "\t6. 2年以上工作经验\\n"',
        '    };',
        '',
        '    /** 这是要大出血的节凑啊,幸好公司有钱很任性~~~ */',
        '    private static final String remuneration = ',
        '        "如果你确实优秀,薪酬待遇根本不是问题,而且个人发展空间很大吆,亲!";',
        '',
        '    /** 郑重警告 */',
        '    private static final String warning = ',
        '        "警告: 我们招\'攻\'城狮,但我们不搞基!";',
        '',
        '    /**',
        '     * 发布人才召集江湖令',
        '     */',
        '    //@Override',
        '    public static void publish() {',
        '',
        '        System.out.println(slogan);',
        '',
        '        for(String req : requisites) {',
        '            System.out.println(req);',
        '        }',
        '',
        '        System.out.println(remuneration);',
        '',
        '        System.out.println(warning);',
        '    }',
        '',
        '    public static void main(String[] args){',
        '        publish();   ',
        '    }',
        '}</pre>'
    );

    var typeit = typewriter(lines);
    typeit();
}
