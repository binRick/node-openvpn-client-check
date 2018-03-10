  Options:

    -V, --version            output the version number
    -c, --config <config>    OpenVPN Config File
    -o, --openvpn <openvpn>  OpenVPN Binary
    -t, --timeout <timeout>  Timeout to Fail in Seconds
    -d, --debug <debug>      Debug Mode
    -h, --help               output usage information

example:

./index.js -o /usr/sbin/openvpn -c /path/to/openvpnClientConfig.ovpn -t 15
