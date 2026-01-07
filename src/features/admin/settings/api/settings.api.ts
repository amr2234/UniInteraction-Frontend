import { BaseApi } from '@/core/lib/baseApi';
import { SystemSettingDto, CreateSystemSettingCommand } from '../types/models';

export interface UpdateSystemSettingCommand extends CreateSystemSettingCommand {
  id?: number;  
}

class SystemSettingsApi extends BaseApi<SystemSettingDto, CreateSystemSettingCommand, UpdateSystemSettingCommand> {
  constructor() {
    super('/systemsettings');
  }

  async getSettings(): Promise<SystemSettingDto[]> {
    return this.getList();
  }

  async getSettingById(id: number): Promise<SystemSettingDto> {
    return this.getById(id);
  }

  async createSetting(command: CreateSystemSettingCommand): Promise<SystemSettingDto> {
    return this.create(command);
  }

  async updateSetting(id: number, command: UpdateSystemSettingCommand): Promise<SystemSettingDto> {
    return this.update(id, command);
  }
}

const systemSettingsApiInstance = new SystemSettingsApi();

export const systemSettingsApi = {
  getSettings: () => systemSettingsApiInstance.getSettings(),
  getSettingById: (id: number) => systemSettingsApiInstance.getSettingById(id),
  createSetting: (command: CreateSystemSettingCommand) => systemSettingsApiInstance.createSetting(command),
  updateSetting: (id: number, command: UpdateSystemSettingCommand) => 
    systemSettingsApiInstance.updateSetting(id, command),
};
