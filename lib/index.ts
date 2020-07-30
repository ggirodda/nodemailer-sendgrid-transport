import sgMail from '@sendgrid/mail';
import packageData from '../package.json'
interface SendgridTransportOptions {
    auth: { apiKey: string }
}
interface SendgridMessageOptions {
    to: string | string[],
    from: string,
    subject: string,
    text: string,
    html: string,
}

interface NodemailerTransportInterface {
    name: string,
    version: string,
    send: ({ data: SendgridMessageOptions }, callback: CallableFunction) => void
}

class SendgridTransport implements NodemailerTransportInterface {
    public name: string = packageData.name
    public version: string = packageData.version
    private options: SendgridTransportOptions
    constructor(options: SendgridTransportOptions) {
        this.options = options;
    }
    public send({ data }: { data: SendgridMessageOptions }, callback: CallableFunction): void {
        sgMail.setApiKey(this.options.auth.apiKey)
        const sendMultiple = Array.isArray(data.to);
        sgMail.send(data, sendMultiple)
            .then((res) => { callback(null, res) })
            .catch((err) => { callback(err) })
    }
}

const sgTransport = (options: SendgridTransportOptions): NodemailerTransportInterface => new SendgridTransport(options)

export {
    sgTransport,
    NodemailerTransportInterface,
    SendgridTransportOptions,
    SendgridMessageOptions
}