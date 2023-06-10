import {
  Controller,
  Get,
  Post,
  Delete,
  Put,
  Res,
  Req,
  UseInterceptors,
  UploadedFile,
  Param,
  NotFoundException,
  Body,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request, Response, Express } from 'express';
import { createHash } from 'node:crypto';
import { writeFile } from 'node:fs/promises';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'users/services/users.service';
import { UpdateDTO } from 'users/dto/update.dto';
import { SignUpDTO } from 'users/dto/signUp.dto';
import { SignInDTO } from 'users/dto/signIn.dto';
import { PasswordInterceptor } from 'users/interceptors/password.interceptor';
import Unprotected from 'decorators/Unprotected';

@Controller('users')
@ApiTags('users')
@UseInterceptors(PasswordInterceptor)
export class UsersController {
  constructor(
    private readonly service: UsersService,
    private readonly config: ConfigService,
    private readonly jwt: JwtService,
  ) {}

  // POST /users/signUp
  @Post('signUp')
  @Unprotected()
  @ApiOperation({ summary: 'Register a new system user.' })
  @ApiConflictResponse({ description: 'Email already registered.' })
  @ApiCreatedResponse({ description: 'User created.' })
  async signUp(@Body() dto: SignUpDTO) {
    const user = await this.service.create(dto);
    return { user };
  }

  // POST /users/signIn
  @Post('signIn')
  @HttpCode(HttpStatus.OK)
  @Unprotected()
  @ApiOperation({ summary: 'Authorize a system user.' })
  @ApiOkResponse({ description: 'User authorized.' })
  @ApiNotFoundResponse({ description: 'User does not exist.' })
  async signIn(@Body() dto: SignInDTO) {
    const { email, password } = dto;
    const user = await this.service.findByEmailAndPassword(email, password);

    if (user) {
      const SECRET = this.config.get('SECRET');
      const payload = {
        id: user.id,
        email: user.email,
        name: user.name,
        avatarId: user.avatarId,
      };
      const token = await this.jwt.signAsync(payload, {
        secret: SECRET,
        expiresIn: '2h',
      });
      return { token };
    }

    throw new NotFoundException('User does not exist');
  }

  // GET /users/me
  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user. In other words, you.' })
  @ApiOkResponse({ description: 'User found.' })
  @ApiNotFoundResponse({ description: 'User does not exist.' })
  async me(@Req() request: Request) {
    const userFromAuthToken = request['user'];
    const userId = userFromAuthToken['id'];
    const user = await this.service.findById(userId);

    if (user) {
      return { user };
    }

    throw new NotFoundException('User does not exist');
  }

  // GET /users
  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all users.' })
  @ApiOkResponse({ description: 'Returns an array containing all users.' })
  async users() {
    const users = await this.service.findAll();
    return { users };
  }

  // GET /users/:userId
  @Get(':userId')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a specific user.' })
  @ApiOkResponse({ description: 'User found.' })
  @ApiNotFoundResponse({ description: 'User does not exist.' })
  async user(@Param('userId', ParseUUIDPipe) userId: string) {
    const user = await this.service.findById(userId);

    if (user) {
      return { user };
    }

    throw new NotFoundException('User does not exist');
  }

  // DELETE /users/:userId
  @Delete(':userId')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a specific user.' })
  @ApiOkResponse({ description: 'User deleted.' })
  @ApiNotFoundResponse({ description: 'User does not exist.' })
  async delete(@Param('userId', ParseUUIDPipe) userId: string) {
    const user = await this.service.delete(userId);
    return { user };
  }

  // PUT /users/:userId
  @Put(':userId')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a specific user.' })
  @ApiOkResponse({ description: 'User updated successfully.' })
  @ApiNotFoundResponse({ description: 'User does not exist.' })
  async update(
    @Body() dto: UpdateDTO,
    @Param('userId', ParseUUIDPipe) userId: string,
  ) {
    const user = await this.service.update(userId, dto);
    return { user };
  }

  // POST /users/:userId/avatar
  @Post(':userId/avatar')
  @ApiBearerAuth()
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Set a specific user avatar.' })
  @ApiOkResponse({ description: 'User avatar updated.' })
  @ApiNotFoundResponse({ description: 'User does not exist.' })
  async setAvatar(
    @UploadedFile() file: Express.Multer.File,
    @Param('userId', ParseUUIDPipe) userId: string,
  ) {
    const user = await this.service.findById(userId);

    if (!user) {
      throw new NotFoundException('User does not exist');
    }

    const { buffer, originalname } = file;

    const bufferHash = createHash('sha256');
    bufferHash.update(buffer);
    const hashedBuffer = bufferHash.digest('hex');

    const nameHash = createHash('sha256');
    nameHash.update(originalname);
    const hashedName = nameHash.digest('hex');

    const avatarId = hashedBuffer + '-' + hashedName;
    const AVATAR_FOLDER = this.config.get('AVATAR_FOLDER');

    try {
      await writeFile(`${AVATAR_FOLDER}/${avatarId}`, buffer);
      const updatedUser = await this.service.update(userId, { avatarId });
      return { user: updatedUser };
    } catch {
      throw new InternalServerErrorException();
    }
  }

  // GET /users/:userId/avatar
  @Get(':userId/avatar')
  @Unprotected()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a specific user avatar.' })
  @ApiOkResponse({ description: 'User avatar found.' })
  @ApiNotFoundResponse({ description: 'User does not exist.' })
  async getAvatar(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Res() response: Response,
  ) {
    const user = await this.service.findById(userId);

    if (user) {
      const AVATAR_FOLDER = this.config.get('AVATAR_FOLDER');
      response.sendFile(`${AVATAR_FOLDER}/${user.avatarId}`);
      return;
    }

    throw new NotFoundException('User does not exist');
  }
}
