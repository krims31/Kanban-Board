import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { ProjectsService } from './projects.service';

// Description type mock (can extension if need)
type PrismaMock = {
  project: {
    create: jest.Mock;
    findMany: jest.Mock;
    findFirst: jest.Mock;
    update: jest.Mock;
    delete: jest.Mock;
  };
};

describe('ProjectsService', () => {
  let service: ProjectsService;
  let prisma: PrismaMock;

  beforeEach(async () => {
    prisma = {
      project: {
        create: jest.fn(),
        findMany: jest.fn(),
        findFirst: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectsService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<ProjectsService>(ProjectsService);
  });

  describe('create', () => {
    it('Created project with ownerId and then return result', async () => {
      // What will return the mock.
      const dto = { title: 'My Project', description: 'desc' };

      const created = {
        id: '1',
        title: 'My Project',
        description: 'desc',
        ownerId: 'u1',
      };
      prisma.project.create.mockResolvedValue(created);

      // Act (call result)
      const result = await service.create(dto, 'u1');

      // Assert (verification)
      expect(result).toEqual(created);
      expect(prisma.project.create).toHaveBeenCalledWith({
        data: { title: 'My Project', description: 'desc', ownerId: 'u1' },
      });
    });
  });

  describe('findAllByUser', () => {
    it('find all the users by ownerId and also return all projects', async () => {
      // What will return the mock.
      const projects = [
        {
          id: 'p1',
          title: 'A',
          description: null,
          ownerId: 'u1',
          createAt: new Date(),
        },
        {
          id: 'p2',
          title: 'B',
          description: null,
          ownerId: 'u1',
          createAt: new Date(),
        },
      ];

      prisma.project.findMany.mockResolvedValue(projects);

      // Act(call result)
      const result = await service.findAllByUser('u1');

      // Assert (verification)
      expect(result).toEqual(projects);
      expect(prisma.project.findMany).toHaveBeenCalledWith({
        where: { ownerId: 'u1' },
      });
    });

    it('return empty array when user has no projects', async () => {
      prisma.project.findMany.mockResolvedValue([]);

      const result = await service.findAllByUser('u1');

      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('return project if you find', async () => {
      // What will return the mock.
      const project = { id: 'p1', title: 'X', ownerId: 'u1' };

      prisma.project.findFirst.mockResolvedValue(project);

      // Act (call result)
      const result = await service.findOne('p1', 'u1');

      // Assert (verification)
      expect(result).toEqual(project);
      expect(prisma.project.findFirst).toHaveBeenCalledWith({
        where: { id: 'p1', ownerId: 'u1' },
      });
    });

    it('throw NotFoundException if project not found', async () => {
      prisma.project.findFirst.mockResolvedValue(null);

      await expect(service.findOne('p1', 'u1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('update a project', async () => {
      // What will return the mock.
      prisma.project.findFirst.mockResolvedValue({ id: 'p1', ownerId: 'u1' });

      prisma.project.update.mockResolvedValue({ id: 'p1', title: 'New' });

      // Act(call result)
      const result = await service.update('p1', 'u1', { title: 'New' });

      // Assert (verification)
      expect(result).toEqual({ id: 'p1', title: 'New' });
      expect(prisma.project.findFirst).toHaveBeenCalled();
      expect(prisma.project.update).toHaveBeenCalledWith({
        where: { id: 'p1' },
        data: { title: 'New' },
      });
    });

    it('throw 404 and NOT update, if project not found', async () => {
      prisma.project.findFirst.mockResolvedValue(null);

      await expect(service.update('p1', 'u1', { title: 'X' })).rejects.toThrow(
        NotFoundException,
      );
      expect(prisma.project.update).not.toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('delete a project, if he exist and belong the user', async () => {
      // What will return the mock.
      prisma.project.findFirst.mockResolvedValue({ id: 'p1', ownerId: 'u1' });
      prisma.project.delete.mockResolvedValue({ id: 'p1' });

      // Act(call result)
      await service.delete('p1', 'u1');

      // Assert (verification)
      expect(prisma.project.delete).toHaveBeenCalledWith({
        where: { id: 'p1' },
      });
    });

    it('throw 404 and NOT update, if project not found', async () => {
      prisma.project.findFirst.mockResolvedValue(null);

      await expect(service.delete('p1', 'u1')).rejects.toThrow(
        NotFoundException,
      );
      expect(prisma.project.delete).not.toHaveBeenCalled();
    });

    it('Not delete the different project', async () => {
      prisma.project.findFirst.mockResolvedValue(null);

      await expect(service.delete('p1', 'other')).rejects.toThrow(
        NotFoundException,
      );
      expect(prisma.project.delete).not.toHaveBeenCalled();
    });
  });
});
