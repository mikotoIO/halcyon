import { proxy, ref } from "valtio/vanilla";

import type { MikotoClient } from "../MikotoClient";
import {
	type ChannelCreatePayload,
	SpaceExt,
	type SpaceUpdatePayload,
} from "../api.gen";
import { ZSchema } from "../helpers/ZSchema";
import { CachedManager } from "./base";

export class MikotoSpace extends ZSchema(SpaceExt) {
	client!: MikotoClient;

	constructor(base: SpaceExt, client: MikotoClient) {
		const cached = client.spaces.cache.get(base.id);
		if (cached) {
			cached._patch(base);
			return cached;
		}

		super(base);
		this.client = ref(client);
		return proxy(this);
	}

	_patch(data: SpaceExt) {
		Object.assign(this, data);
	}

	async edit(data: SpaceUpdatePayload) {
		const space = await this.client.rest["spaces.update"](data, {
			params: { spaceId: this.id },
		});
		this._patch(space);
		return this;
	}

	async delete() {
		await this.client.rest["spaces.delete"](undefined, {
			params: { spaceId: this.id },
		});
		this.client.spaces.cache.delete(this.id);
	}

	async leave() {
		await this.client.rest["spaces.leave"](undefined, {
			params: { spaceId: this.id },
		});
		this.client.spaces.cache.delete(this.id);
	}

	async createChannel(data: ChannelCreatePayload) {
		const channel = await this.client.rest["channels.create"](data, {
			params: { spaceId: this.id },
		});
		return channel;
	}
}

export class SpaceManager extends CachedManager<MikotoSpace> {
	constructor(client: MikotoClient) {
		super(client);
		return proxy(this);
	}

	async list() {
		const spaces = await this.client.rest["spaces.list"]();
		return spaces.map((space) => new MikotoSpace(space, this.client));
	}

	async join(invite: string) {
		const space = await this.client.rest["spaces.join"](undefined, {
			params: { invite },
		});
		return new MikotoSpace(space, this.client);
	}
}
