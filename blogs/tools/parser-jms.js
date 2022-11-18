/**
 * The code parse just-my-socks subscription api response, convert to clash format.
 * Additionally, it invokes remaining api then generate remaining info for clash-for-windows client.
 * Generated configuration segement example as follows:
 * # upload=0; download=12345; total=100000000000; expire=1667232000;
 * proxies:
 *   - name: server-config-01
 *     type: ss
 *     server: 12.34.56.78
 *     port: 12345
 *     cipher: aes-256-gcm
 *     password: abcdefg
 *   - ...
 * proxy-groups:
 *   - name: jms-proxy
 *     type: select
 *     proxies:
 *       - server-config-01
 *       - ...
 * rules:
 *   - MATCH,jms-proxy
 */

/** just-my-socks remaining info api */
const JMS_REMAINING_API = "https://justmysocks5.net/members/getbwcounter.php?service=${service}&id=${id}";

/**
 * calculate expire for clash-for-windows client
 * @param day from just-my-socks remaining api, the meaning is day-of-month 
 * @return expired date (in unixtime format)
 */
 function calculateExpire(day) {
    let today = new Date();
    let year = today.getFullYear();
    let month = today.getMonth();
    if (today.getDate() >= day) {
        if (month == 11) {
            year += 1;
        } else {
            month += 1;
        }
    }
    let expire = new Date(year, month, day);
    return expire.getTime() / 1000;
}

/** parse remaining info from just my socks API response body*/
async function fetchRemaining(axios, service, id) {
    let url = JMS_REMAINING_API.replace("${service}", service).replace("${id}", id)
    let response = await axios.get(url);
    // {"monthly_bw_limit_b":100000000000,"bw_counter_b":22753528556,"bw_reset_day_of_month":18}
    let data = response.data;
    let download = data.bw_counter_b;
    let total = data.monthly_bw_limit_b;
    let expire = calculateExpire(data.bw_reset_day_of_month);
    return `#upload=0; download=${download}; total=${total}; expire=${expire};\n`;
}

/** parse shadowsocks standard share uri */
function parseShadowsocks(str) {
    // shadowsocks URI parttern: ss://{server config, base64 encoded}#{server name}
    // server config pattern: {cipher}:{password}@{server ip/domain}:${port} ,
    // but password section maybe contains any character
    const SS_URI_PATTERN = /^ss:\/\/(\w+)(#(.+))?$/;
    const SS_SERVER_PATTERN = /([\w-]+):(.+)@([\w\.]+):(\d+)/;
    let matched = str.match(SS_URI_PATTERN);
    if (matched == null) {
        return null;
    }
    // ciper:password@server:port
    let config = atob(matched[1]).match(SS_SERVER_PATTERN);
    if (config == null) {
        return null;
    }
    let ciper = config[1];
    let password = config[2];
    let server = config[3];
    let port = config[4];
    // get or create config name
    let name = matched.length == 4 ? matched[3] : (server + ":" + port);
    return {
        name: name,
        type: "ss",
        server: server,
        port: parseInt(port),
        cipher: ciper,
        password: password
        // udp: true
    }
}

/** parse vmess non-standard share config (just my socks version) */
function parseVMess(str) {
    // VMess URI pattern: vmess://{server config, base64 encoded}
    const VMESS_URI_PATTERN = /^vmess:\/\/(\w+)$/;
    let matched = str.match(VMESS_URI_PATTERN);
    if (matched == null) {
        return null;
    }
    // server config is a json string, example as follows:
    // {
    //      ps: config name,
    //      add: server ip/domain,
    //      port: server port,
    //      id: user id,
    //      aid: alter id,
    //      net: network protocol (tcp/grpc/...),
    //      type: maybe tcp obfs type?,
    //      tls: enabled tls?
    // }
    let config = JSON.parse(atob(matched[1]));
    return {
        name: config.ps,
        type: "vmess",
        server: config.add,
        port: parseInt(config.port),
        uuid: config.id,
        alterId: config.aid,
        cipher: "auto",
        //udp: false,
        tls: false
        //"skip-cert-verify": false,
        //servername: servername
    }
}

/** parse server config string */
function parseServer(config) {
    if (config.startsWith("ss://")) {
        return parseShadowsocks(config);
    }
    if (config.startsWith("vmess://")) {
        return parseVMess(config);
    }
    return null;
}

module.exports.parse = async (raw, { axios, yaml, notify, console }, { name, url, interval, selected }) => {
    // `raw` is raw body from response, base64 encoded text, ervery line is a server config
    let servers = atob(raw).split('\n').map(parseServer).filter(server => server != null);
    let params = new URLSearchParams(url.substring(url.indexOf("?") + 1));
    let remaining = "";
    try {
        remaining = await fetchRemaining(axios, params.get("service"), params.get("id"));
    } catch (e) {
        // notify：send a system notification, function signature is: `function notify(title:string, message:string, silent:bool)`
        notify("fetch remaining error.", "cannot fetch remaining info of just my socks", true);
        return "";
    }
    let config = {
        proxies: servers,
        "proxy-groups": [{
            name: "jms-proxy",
            type: "select",
            proxies: servers.map(server => server.name)
        }],
        rules: ["MATCH,jms-proxy"]
    }
    notify("just my socks updated!", "just my socks server & remaining updated!", false);
    return remaining + yaml.stringify(config);
  }
