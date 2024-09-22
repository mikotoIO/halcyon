import { proxyMap } from "valtio/utils";

import type { MikotoClient } from "../MikotoClient";
import { ref } from "valtio";

export class CachedManager<T> {
	public cache: Map<string, T>;
	client: MikotoClient;

	constructor(client: MikotoClient) {
		this.client = ref(client);
		this.cache = proxyMap();
	}
}

export class Manager {
	client: MikotoClient;

	constructor(client: MikotoClient) {
		this.client = ref(client);
	}
}
