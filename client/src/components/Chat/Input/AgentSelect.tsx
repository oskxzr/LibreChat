import React from "react";
import { Bot } from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuItem,
} from "@librechat/client";
import { useGetAgentsQuery } from "~/data-provider";
import { useSetAgent } from "~/hooks/Agents/useSetAgent";

export function AgentSelect() {
	// 1. Fetch user's agents
	const { data: agentsResponse } = useGetAgentsQuery();
	const { setAgent } = useSetAgent();

	// Extract the list of user agents (excluding default/marketplace placeholders)
	const agents = agentsResponse?.data ?? [];

	if (!agents || agents.length === 0) {
		return null; // Don't render anything if the user has no agents
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<button
					type="button"
					aria-label="Select Agent"
					className="flex h-9 items-center gap-1.5 rounded-lg border border-border-light bg-transparent px-2.5 py-1 text-xs text-text-primary transition-colors hover:bg-surface-hover"
				>
					<Bot className="h-4 w-4 text-text-secondary" />
					<span className="font-medium">Agents</span>
				</button>
			</DropdownMenuTrigger>

			<DropdownMenuContent align="start" className="w-48 max-h-60 overflow-y-auto">
				{agents.map((agent) => (
					<DropdownMenuItem
						key={agent.id}
						onClick={() => setAgent(agent.id)}
						className="flex items-center gap-2 cursor-pointer text-sm"
					>
						{agent.avatar ? (
							<img
								src={agent.avatar.filepath}
								alt={agent.name}
								className="h-4 w-4 rounded-full"
							/>
						) : (
							<Bot className="h-4 w-4 text-text-tertiary" />
						)}
						<span className="truncate">{agent.name || "Unnamed Agent"}</span>
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
