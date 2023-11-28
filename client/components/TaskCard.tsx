import { useContext } from "react";
import { TaskContext } from "@/context/tasksContext";
import { Task, TaskContextType } from "@/types/Task"
import { removeTask, updateTask } from "@/lib/tasks";
import Button from "./Button";

interface TaskCardProps {
    task: Task;
}

const TaskCard = ({ task }: TaskCardProps) => {
    const { tasks, setTasks } = useContext(TaskContext) as TaskContextType;

    const handleRemoveTask = async (taskId: string) => {
        // Optimistic UI
        setTasks(prevTasks => {
            return prevTasks!.filter(task => task.id !== taskId);
        })

        // Actual action
        const removedTask = await removeTask(taskId);
        console.log(removedTask);
    }

    const handleUpdateTask = async (taskId: string) => {
        // // Optimistic UI
        setTasks(prevTasks => {
            return prevTasks!.map(
                task => task.id === taskId
                    ? { ...task, completed: !task.completed }
                    : task
            )
        })

        // Actual action
        let newUpdatedTask = tasks!.find(task => task.id === taskId);
        if (newUpdatedTask) newUpdatedTask = {
            ...newUpdatedTask,
            completed: !newUpdatedTask.completed
        };

        if (newUpdatedTask) {
            const completedTask = await updateTask(newUpdatedTask);
            console.log(completedTask);
        }
    }

    return (
        <div className='flex justify-between items-start border border-[#27272a] p-6 rounded-md'>
            <div className='flex flex-col space-y-1.5'>
                <h1 className='text-2xl font-bold'>{task.title}</h1>
                <h1 className='text-[#a1a1aa] text-sm'>{task.description}</h1>
                <h1 className={`${task.completed ? 'text-green-500' : 'text-red-500'} text-sm`}>
                    {task.completed ? 'Completed' : 'Not Completed'}
                </h1>
            </div>
            <div className='flex flex-col gap-3'>
                {!task.completed && <Button onClick={() => handleUpdateTask(task.id)} color="green">Done {'->'}</Button>}
                {task.completed && <Button onClick={() => handleUpdateTask(task.id)} color="blue">{'<-'} Revert</Button>}
                <Button onClick={() => handleRemoveTask(task.id)} color="red">Delete</Button>
            </div>
        </div>
    )
}

export default TaskCard;
