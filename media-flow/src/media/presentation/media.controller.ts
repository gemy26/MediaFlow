import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { GetMedia } from '../application/use-cases/get-media';
import { MediaResponseDto } from './dtos/media-response.dto';
import { MediaUpdateDto } from './dtos/media-update.dto';
import { UpdateMedia } from '../application/use-cases/update-media';
import { DeleteMedia } from '../application/use-cases/delete-media';
import { ListMedia } from '../application/use-cases/list-media';
import { AddMediaDto } from './dtos/add-media.dto';
import { AddMedia } from '../application/use-cases/add-media';
import { AddMediaResponseDto } from './dtos/add-media-response.dto';
import { CompleteUpload } from '../application/use-cases/complete-upload';

@Controller('api/media')
export class MediaController {
  constructor(
    private readonly getMedia: GetMedia,
    private readonly updateMedia: UpdateMedia,
    private readonly deleteMedia: DeleteMedia,
    private readonly listMedia: ListMedia,
    private readonly addMedia: AddMedia,
    private readonly completeUpload: CompleteUpload,
  ) {}

  @Get('/')
  async listAll(): Promise<MediaResponseDto[]> {
    return (await this.listMedia.execute()).map((m) =>
      MediaResponseDto.fromDomain(m),
    );
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return MediaResponseDto.fromDomain(await this.getMedia.execute(id));
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() data: MediaUpdateDto,
  ): Promise<void> {
    await this.updateMedia.execute(id, data);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.deleteMedia.execute(id);
  }

  @Post()
  async initUpload(@Body() data: AddMediaDto): Promise<AddMediaResponseDto> {
    const ownerId = '';
    const output = await this.addMedia.execute({ ...data, ownerId });
    return AddMediaResponseDto.from(output);
  }

  @Post('/upload/:id/complete')
  async complete(@Param('id') id: string): Promise<void> {
    return await this.completeUpload.execute(id);
  }
}
