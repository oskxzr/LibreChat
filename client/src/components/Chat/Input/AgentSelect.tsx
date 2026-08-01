import React, { useMemo, useCallback } from "react";
import { Bot, Check, X } from "lucide-react";
import { EModelEndpoint } from "librechat-data-provider";
import { useAgentsMapContext, useChatContext } from "~/Providers";
import useSelectMention from "~/hooks/Input/useSelectMention";
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
} from "~/components/ui/DropdownMenu"; // <--- Added /DropdownMenu to direct path

export function AgentSelect() {
	const { conversation, newConversation } = useChatContext();
	const agentsMap = useAgentsMapContext();

	const { onSelectEndpoint } = useSelectMention({
		newConversation,
		returnHandlers: true,
	});

	const agents = useMemo(() => Object.values(agentsMap ?? {}), [agentsMap]);
	const currentAgentId = conversation?.agent_id;

	const selectedAgent = useMemo(() => {
		if (!currentAgentId || !agentsMap) return null;
		return agentsMap[currentAgentId] ?? null;
	}, [agentsMap, currentAgentId]);

	const handleSelectAgent = useCallback(
		(agentId: string) => {
			const agent = agentsMap?.[agentId];
			onSelectEndpoint?.(EModelEndpoint.agents, {
				agent_id: agentId,
				model: agent?.model ?? "",
			});
		},
		[agentsMap, onSelectEndpoint],
	);

	const handleDeselectAgent = useCallback(() => {
		const fallbackEndpoint = conversation?.endpointType ?? EModelEndpoint.custom;
		onSelectEndpoint?.(fallbackEndpoint);
	}, [conversation?.endpointType, onSelectEndpoint]);

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
				{selectedAgent && (
					<>
						<DropdownMenuItem
							onClick={handleDeselectAgent}
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
							onClick={() => handleSelectAgent(agent.id)}
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
