import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { TimeoutError } from 'rxjs';
import {
  InternalServerErrorException,
  NotFoundException,
  RequestTimeoutException
} from '@nestjs/common';
import { PermissionsService } from '../permissions.service';
import { PermissionResponseDto } from '../dtos';
import { PermissionEntity } from '../permission.entity';
import { PermissionMapper } from '../permission.mapper';
import { PermissionFactory } from './permission-enitity.factory';
import { PaginationRequest, PaginationResponse } from '../../../../../common/pagination';
import { PermissionExistsException } from '../../../../../common/exeptions';
import { DbUniqueConstraintError } from '../../../../../common/mocks';


const paginationRequest: PaginationRequest = {
  page: 1,
  order: { description: 'ASC' },
  skip: 0,
  limit: 10,
  params: { search: 'some text' }
}

describe('PermissionsService', () => {
  const getCountSpy = jest.fn();
  const getManySpy = jest.fn();
  let permissionsRepository: Repository<PermissionEntity>
  let permissionsService: PermissionsService;
  let permissionMock;

  beforeEach(async () => {
    permissionMock = await PermissionFactory.buildList(paginationRequest.limit);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PermissionsService,
        {
          provide: getRepositoryToken(PermissionEntity),
          useValue: {
            save: jest.fn().mockResolvedValue(permissionMock[0]),
            find: jest.fn(),
            findOne: jest.fn().mockResolvedValue(permissionMock[0]),
            createQueryBuilder: jest.fn(() => ({
              skip: jest.fn().mockReturnThis(),
              take: jest.fn().mockReturnThis(),
              orderBy: jest.fn().mockReturnThis(),
              where: jest.fn().mockReturnThis(),
              getCount: getCountSpy,
              getMany: getManySpy
            }),
            ),
          }
        }
      ],
    }).compile();
    permissionsRepository = module.get(getRepositoryToken(PermissionEntity));
    permissionsService = module.get<PermissionsService>(PermissionsService);
  });

  describe('getAllPermissions', () => {

    it('getAllPermissions is able to retreive permissions', async () => {
      getCountSpy.mockResolvedValue(permissionMock.length);
      getManySpy.mockResolvedValue(permissionMock);

      expect(getCountSpy).not.toHaveBeenCalled();
      expect(getManySpy).not.toHaveBeenCalled();
      const result: PaginationResponse<PermissionResponseDto> = await permissionsService.getAllPermissions(paginationRequest);
      expect(result.content).toStrictEqual(permissionMock.map(PermissionMapper.toDto));
      expect(result.totalRecords).toEqual(permissionMock.length);
      expect(getCountSpy).toHaveBeenCalledTimes(1);
      expect(getManySpy).toHaveBeenCalledTimes(1);
    });

  });

  describe('getPermissionById', () => {
    it('getPermissionById is able to retrieve the permission', async () => {
      expect(permissionsRepository.findOne).not.toHaveBeenCalled();
      const result: PermissionResponseDto = await permissionsService.getPermissionById(permissionMock[0].id);
      expect(result).toEqual(PermissionMapper.toDto(permissionMock[0]));
      expect(permissionsRepository.findOne).toHaveBeenCalledWith(permissionMock[0].id);
    });

    it('getPermissionById throw NotFoundException', () => {
      jest.spyOn(permissionsRepository, 'findOne').mockResolvedValue(undefined);
      expect(permissionsService.getPermissionById(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('createPermission', () => {
    it('createPermission', async () => {
      expect(permissionsRepository.save).not.toHaveBeenCalled();
      const result: PermissionResponseDto = await permissionsService.createPermission(permissionMock[0]);
      expect(result).toStrictEqual(PermissionMapper.toDto(permissionMock[0]));
      expect(permissionsRepository.save).toHaveBeenCalledWith(PermissionMapper.toCreateEntity(permissionMock[0]));
    });

    it('createPermission throw PermissionExistsException', async () => {
      jest.spyOn(permissionsRepository, 'save').mockImplementation(() => {
        throw new DbUniqueConstraintError();
      });
      await expect(permissionsService.createPermission(permissionMock[0])).rejects.toThrow(PermissionExistsException);
    });

    it('createPermission throw RequestTimeoutException', async () => {
      jest.spyOn(permissionsRepository, 'save').mockImplementation(() => {
        throw new TimeoutError();
      });
      await expect(permissionsService.createPermission(permissionMock)).rejects.toThrow(RequestTimeoutException);
    });

    it('createPermission throw InternalServerErrorException', async () => {
      jest.spyOn(permissionsRepository, 'save').mockImplementation(() => {
        throw new Error();
      });
      await expect(permissionsService.createPermission(permissionMock)).rejects.toBeInstanceOf(InternalServerErrorException);
    });
  });

  describe('updatePermission', () => {
    it('updatePermission is able to modify the permission', async () => {
      expect(permissionsRepository.findOne).not.toHaveBeenCalled();
      expect(permissionsRepository.save).not.toHaveBeenCalled();
      const result: PermissionResponseDto = await permissionsService.updatePermission(permissionMock[0].id, permissionMock[1]);
      expect(permissionsRepository.findOne).toHaveBeenCalledWith(permissionMock[0].id);
      expect(permissionsRepository.findOne).toBeCalledTimes(1);
      expect(permissionsRepository.save).toHaveBeenCalledWith(permissionMock[1]);
      expect(permissionsRepository.save).toBeCalledTimes(1);
      expect(result).toStrictEqual(PermissionMapper.toDto(permissionMock[0]));
    });

    it('updatePermission throw NotFoundException', async () => {
      jest.spyOn(permissionsRepository, 'findOne').mockResolvedValue(undefined);
      await expect(permissionsService.updatePermission(permissionMock[0].id, permissionMock[1])).rejects.toThrow(NotFoundException);
    });

    it('updatePermission throw PermissionAlreadyExistsException', async () => {
      jest.spyOn(permissionsRepository, 'save').mockImplementation(() => {
        throw new DbUniqueConstraintError();
      });
      await expect(permissionsService.updatePermission(permissionMock[0].id, permissionMock[1])).rejects.toThrow(PermissionExistsException);
    });

    it('updatePermission throw RequestTimeoutException', async () => {
      jest.spyOn(permissionsRepository, 'save').mockImplementation(() => {
        throw new TimeoutError();
      });
      await expect(permissionsService.updatePermission(permissionMock[0].id, permissionMock[1])).rejects.toThrow(RequestTimeoutException);
    });

    it('updatePermission throw InternalServerErrorException', async () => {
      jest.spyOn(permissionsRepository, 'save').mockImplementation(() => {
        throw new Error();
      });
      await expect(permissionsService.updatePermission(permissionMock[0].id, permissionMock[1])).rejects.toThrow(InternalServerErrorException);
    });
  });
});