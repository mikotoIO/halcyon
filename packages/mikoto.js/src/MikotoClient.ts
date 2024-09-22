import { createApiClient, Api } from "./api.gen";
import { ChannelManager } from "./managers/channel";
import { SpaceManager } from "./managers/space";
import { WebsocketApi } from "./WebsocketApi";

export interface MikotoClientOptions {
  url: string;
}

export class MikotoClient {
  public rest: Api;
  public ws: WebsocketApi;

  spaces = new SpaceManager(this);
  channels = new ChannelManager(this);

  constructor(options: MikotoClientOptions) {
    this.rest = createApiClient(options.url, {});
    const websocketUrl = new URL(options.url);
    websocketUrl.protocol = websocketUrl.protocol.replace("http", "ws");
    this.ws = new WebsocketApi({
      url: `${websocketUrl.origin}/ws`,
    });
  }
}
