import { proxy, ref } from "valtio/vanilla";
import type { MikotoClient } from "../MikotoClient";
import { Channel, type ChannelPatch } from "../api.gen";
import { ZSchema } from "../helpers/ZSchema";
import { CachedManager } from "./base";
import type { MikotoSpace } from "./space";

export class MikotoChannel extends ZSchema(Channel) {
	client!: MikotoClient;

	constructor(base: Channel, client: MikotoClient) {
		const cached = client.channels.cache.get(base.id);
		if (cached) {
			cached._patch(base);
			return cached;
		}

		super(base);
		this.client = ref(client);
		return proxy(this);
	}

	get space(): MikotoSpace | undefined {
		return this.client.spaces.cache.get(this.spaceId);
	}

	_patch(data: Channel) {
		Object.assign(this, data);
	}

	async edit(data: ChannelPatch) {
		const channel = await this.client.rest["channels.update"](data, {
			params: {
				spaceId: this.spaceId,
				channelId: this.id,
			},
		});
		this._patch(channel);
		return this;
	}

	async delete() {
		await this.client.rest["channels.delete"](undefined, {
			params: {
				spaceId: this.spaceId,
				channelId: this.id,
			},
		});
		this.client.channels.cache.delete(this.id);
	}
}

export class ChannelManager extends CachedManager<MikotoChannel> {
	constructor(client: MikotoClient) {
		super(client);
		return proxy(this);
	}
}
