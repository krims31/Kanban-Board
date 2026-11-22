import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Priority, TaskStatus } from '../../../generated/prisma/enums';
import { CreateTaskDto } from '../../dto/CreateTaskDto.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { ProjectsService } from '../projects.service';
import { TasksService } from './tasks.service';

type PrismaMock = {
  task: {
    create: jest.Mock;
    findMany: jest.Mock;
    findFirst: jest.Mock;
    update: jest.Mock;
    delete: jest.Mock;
  };
};

// Projects
type ProjectsMock = {
  findOne: jest.Mock;
};

describe('TasksService', () => {
  let service: TasksService;
  let prisma: PrismaMock;
  let projects: ProjectsMock;

  beforeEach(async () => {
    prisma = {
      task: {
        create: jest.fn(),
        findMany: jest.fn(),
        findFirst: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    };

    projects = {
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: PrismaService, useValue: prisma },
        { provide: ProjectsService, useValue: projects },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
  });

  describe('findOne', () => {
    it('should return a task', async () => {
      // Arrange
      const task = {
        id: 'u1',
        projectId: '1',
      };

      projects.findOne.mockResolvedValue({ id: '1', ownerId: 'p1' });
      prisma.task.findFirst.mockResolvedValue(task);

      // Act
      const result = await service.findOne('u1', '1', 'p1');

      // Assert
      expect(result).toEqual(task);
      expect(projects.findOne).toHaveBeenCalledWith('1', 'p1');
      expect(prisma.task.findFirst).toHaveBeenCalledWith({
        where: { id: 'u1', projectId: '1' },
      });
    });

    it('should throw if the project is not accessible', async () => {
      // Arrange
      projects.findOne.mockRejectedValue(new NotFoundException());

      // Act & Assert
      await expect(service.findOne('u1', '1', 'p1')).rejects.toThrow(
        NotFoundException,
      );

      expect(prisma.task.findFirst).not.toHaveBeenCalled();
    });

    it('should throw if the task is not found', async () => {
      // Arrange
      projects.findOne.mockResolvedValue({ id: '1', ownerId: 'p1' });
      prisma.task.findFirst.mockResolvedValue(null);

      // Act & Assert
      await expect(service.findOne('u1', '1', 'p1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('create', () => {
    it('should create a task', async () => {
      // Arrange
      const dto: CreateTaskDto = {
        title: 'User',
        description: 'desc',
        priority: Priority.MEDIUM,
        dueDate: '',
      };

      const created = {
        id: 'u1',
        projectId: '1',
        title: 'User',
        description: 'desc',
        priority: Priority.MEDIUM,
        dueDate: null,
      };

      projects.findOne.mockResolvedValue({ id: '1', ownerId: 'p1' });
      prisma.task.create.mockResolvedValue(created);

      // Act
      const result = await service.create(dto, '1', 'p1');

      // Assert
      expect(result).toEqual(created);
      expect(projects.findOne).toHaveBeenCalledWith('1', 'p1');
      expect(prisma.task.create).toHaveBeenCalledWith({
        data: {
          title: 'User',
          description: 'desc',
          priority: Priority.MEDIUM,
          dueDate: null,
          projectId: '1',
        },
      });
    });

    it('should not create a task if the project is not accessible', async () => {
      // Arrange
      const dto: CreateTaskDto = {
        title: 'User',
        description: 'desc',
        priority: Priority.MEDIUM,
        dueDate: '',
      };

      projects.findOne.mockRejectedValue(new NotFoundException());

      // Act & Assert
      await expect(service.create(dto, '1', 'p1')).rejects.toThrow(
        NotFoundException,
      );

      expect(projects.findOne).toHaveBeenCalledWith('1', 'p1');
      expect(prisma.task.create).not.toHaveBeenCalled();
    });
  });

  describe('findAllByProject', () => {
    it('should return all tasks in a project', async () => {
      // Arrange
      const tasks = [
        {
          id: 'u1',
          projectId: '1',
        },
        {
          id: 'u2',
          projectId: '1',
        },
      ];

      projects.findOne.mockResolvedValue({ id: '1', ownerId: 'p1' });
      prisma.task.findMany.mockResolvedValue(tasks);

      // Act
      const result = await service.findAllByProject('1', 'p1');

      // Assert
      expect(result).toEqual(tasks);
      expect(projects.findOne).toHaveBeenCalledWith('1', 'p1');
      expect(prisma.task.findMany).toHaveBeenCalledWith({
        where: { projectId: '1' },
      });
    });

    it('should not return tasks if the project is not accessible', async () => {
      // Arrange
      projects.findOne.mockRejectedValue(new NotFoundException());

      // Act & Assert
      await expect(service.findAllByProject('1', 'p1')).rejects.toThrow(
        NotFoundException,
      );

      expect(prisma.task.findMany).not.toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update a task', async () => {
      // Arrange
      const dto = {
        status: TaskStatus.TODO,
      };

      const updatedTask = {
        id: 'u1',
        projectId: '1',
        ownerId: 'p1',
      };

      projects.findOne.mockResolvedValue({ id: '1', ownerId: 'p1' });
      prisma.task.findFirst.mockResolvedValue(updatedTask);
      prisma.task.update.mockResolvedValue(updatedTask);

      // Act
      const result = await service.update('u1', '1', 'p1', dto);

      // Assert
      expect(result).toEqual(updatedTask);
      expect(prisma.task.findFirst).toHaveBeenCalledWith({
        where: { id: 'u1', projectId: '1' },
      });
      expect(prisma.task.update).toHaveBeenCalledWith({
        where: { id: 'u1' },
        data: dto,
      });

      expect(prisma.task.findFirst.mock.invocationCallOrder[0]).toBeLessThan(
        prisma.task.update.mock.invocationCallOrder[0],
      );
    });

    it('should not update a task if it is not found', async () => {
      // Arrange
      projects.findOne.mockResolvedValue({ id: '1', ownerId: 'p1' });
      prisma.task.findFirst.mockResolvedValue(null);

      // Act & Assert
      await expect(
        service.update('u1', '1', 'p1', { status: TaskStatus.TODO }),
      ).rejects.toThrow(NotFoundException);

      expect(prisma.task.update).not.toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('should delete a task', async () => {
      // Arrange
      const deletedTask = {
        id: 'u1',
        projectId: '1',
        ownerId: 'p1',
      };

      projects.findOne.mockResolvedValue({ id: '1', ownerId: 'p1' });
      prisma.task.findFirst.mockResolvedValue(deletedTask);
      prisma.task.delete.mockResolvedValue(deletedTask);

      // Act
      const result = await service.delete('u1', '1', 'p1');

      // Assert
      expect(result).toEqual(deletedTask);
      expect(prisma.task.findFirst).toHaveBeenCalledWith({
        where: { id: 'u1', projectId: '1' },
      });
      expect(prisma.task.delete).toHaveBeenCalledWith({
        where: { id: 'u1' },
      });

      expect(prisma.task.findFirst.mock.invocationCallOrder[0]).toBeLessThan(
        prisma.task.delete.mock.invocationCallOrder[0],
      );
    });

    it('should not delete a task if it is not found', async () => {
      // Arrange
      projects.findOne.mockResolvedValue({ id: '1', ownerId: 'p1' });
      prisma.task.findFirst.mockResolvedValue(null);

      // Act & Assert
      await expect(service.delete('u1', '1', 'p1')).rejects.toThrow(
        NotFoundException,
      );

      expect(prisma.task.delete).not.toHaveBeenCalled();
    });
  });
});
