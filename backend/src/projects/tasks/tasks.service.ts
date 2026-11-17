import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from '../../dto/CreateTaskDto.dto';
import { UpdateTaskDto } from '../../dto/UpdateTaskDto.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { ProjectsService } from '../projects.service';

@Injectable()
export class TasksService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly projectsService: ProjectsService,
  ) {}

  // Create a task.
  async create(dto: CreateTaskDto, projectId: string, ownerId: string) {
    await this.projectsService.findOne(projectId, ownerId);
    return this.prisma.task.create({
      data: {
        title: dto.title,
        description: dto.description ?? null,
        priority: dto.priority ?? 'MEDIUM',
        dueDate: dto.dueDate ? new Date(dto.dueDate) : null,
        projectId,
      },
    });
  }

  // Find all a task the project.
  async findAllByProject(projectId: string, ownerId: string) {
    await this.projectsService.findOne(projectId, ownerId);
    return this.prisma.task.findMany({ where: { projectId } });
  }

  // Find one a task the project.
  async findOne(id: string, projectId: string, ownerId: string) {
    await this.projectsService.findOne(projectId, ownerId);
    const task = await this.prisma.task.findFirst({
      where: { id, projectId },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }
    return task;
  }

  // Update a task the project.
  async update(
    id: string,
    projectId: string,
    ownerId: string,
    dto: UpdateTaskDto,
  ) {
    await this.findOne(id, projectId, ownerId);

    return this.prisma.task.update({
      where: { id },
      data: dto,
    });
  }

  // Delete a task the project.
  async delete(id: string, projectId: string, ownerId: string) {
    await this.findOne(id, projectId, ownerId);

    return this.prisma.task.delete({
      where: { id },
    });
  }
}
