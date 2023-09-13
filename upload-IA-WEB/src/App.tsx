import { Github } from 'lucide-react';
import { Button } from './components/ui/button';
import { Separator } from './components/ui/separator';
function App() {
	return (
		<div className="flex min-h-screen flex-col">
			<div className="flex w-full items-center justify-between border-b px-6 py-3 ">
				<h1 className="text-xl font-bold">Pormade.ai</h1>
				<div className="flex items-center gap-3">
					<span>Desenvolvido com 💚</span>
					<Separator orientation="vertical" className="h-6" />
					<Button variant={'outline'}>
						<Github className="mx-2 h-4 w-4" />
						Github
					</Button>
				</div>
			</div>
			<main className="flex flex-1 gap-6 p-6"> oi</main>
		</div>
	);
}

export default App;
