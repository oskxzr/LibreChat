import React, { useMemo } from "react";
import { Bot, Check, X } from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
} from "@librechat/client";
import { useGetAgentsQuery } from "~/data-provider";
import { useSetAgent } from "~/hooks/Agents/useSetAgent";
import { useChatContext } from "~/Providers";

export function AgentSelect() {
	const { conversation } = useChatContext();
	const { data: agentsResponse } = useGetAgentsQuery();
	const { setAgent } = useSetAgent();

	const agents = agentsResponse?.data ?? [];
	const currentAgentId = conversation?.agent_id;

	const selectedAgent = useMemo(() => {
		if (!currentAgentId) return null;
		return agents.find((a) => a.id === currentAgentId) ?? null;
	}, [agents, currentAgentId]);

	if (!agents || agents.length === 0) {
		return null;
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<button
					type="button"
					aria-label="Select Agent"
					className={`flex h-9 items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs transition-colors ${
						selectedAgent
							? "border-primary/50 bg-primary/10 text-primary font-semibold"
							: "border-border-light bg-transparent text-text-primary hover:bg-surface-hover font-medium"
					}`}
				>
					{selectedAgent ? (
						<>
							{selectedAgent.avatar?.filepath ? (
								<img
									src={selectedAgent.avatar.filepath}
									alt={selectedAgent.name}
									className="h-4 w-4 rounded-full object-cover"
								/>
							) : (
								<Bot className="h-4 w-4 text-primary" />
							)}
							<span className="max-w-[120px] truncate">{selectedAgent.name}</span>
						</>
					) : (
						<>
							<Bot className="h-4 w-4 text-text-secondary" />
							<span>Agents</span>
						</>
					)}
				</button>
			</DropdownMenuTrigger>

			<DropdownMenuContent align="start" className="w-52 max-h-60 overflow-y-auto">
				{/* Option to clear active agent and return to raw model */}
				{selectedAgent && (
					<>
						<DropdownMenuItem
							onClick={() => setAgent(null)}
							className="flex items-center gap-2 cursor-pointer text-sm text-red-500 hover:text-red-600 focus:text-red-600"
						>
							<X className="h-4 w-4" />
							<span>Deselect Agent</span>
						</DropdownMenuItem>
						<DropdownMenuSeparator />
					</>
				)}

				{agents.map((agent) => {
					const isSelected = agent.id === currentAgentId;
					return (
						<DropdownMenuItem
							key={agent.id}
							onClick={() => setAgent(agent.id)}
							className="flex items-center justify-between cursor-pointer text-sm"
						>
							<div className="flex items-center gap-2 truncate">
								{agent.avatar?.filepath ? (
									<img
										src={agent.avatar.filepath}
										alt={agent.name}
										className="h-4 w-4 rounded-full object-cover"
									/>
								) : (
									<Bot className="h-4 w-4 text-text-tertiary" />
								)}
								<span className="truncate">{agent.name || "Unnamed Agent"}</span>
							</div>
							{isSelected && (
								<Check className="h-4 w-4 text-primary ml-2 flex-shrink-0" />
							)}
						</DropdownMenuItem>
					);
				})}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
