import type { TextId } from "@/text/text.js";
import { AText, br, large, param, type PFormattedText, pointText, small } from "@/util/format.js";
import OmegaNum from "omega_num.js";

export const text_zh_impl = {
    'default': '文字缺失, 请反馈 bug.',

    'sidebar.title': '菜单',
    'tab-group.Point': pointText('点数'),
    'tab-group.Stats': '统计数据',
    'tab-group.Settings': '设置',
    'tab.Point': pointText('点数'),
    'tab.StatsRecords': '纪录',
    'tab.Settings': '设置',

    'autosave.never': '从未进行自动存档',
    'autosave.time': ['距离上次自动存档: ', param('time'), '.'],

    'time.s': [param('s'), ' 秒'],
    'time.min': [param('min'), ' 分 ', param('s'), ' 秒'],
    'time.h': [param('h'), ' 小时 ', param('min'), ' 分 ', param('s'), ' 秒'],
    'time.d': [param('d'), ' 天 ', param('h'), ' 小时 ', param(' min '), ' 分'],
    'time.y': [param('y'), ' 年'],

    'header.point': ['你当前有 ', pointText(large(param('amount'))), ' ', pointText('点数.')],
    'endgame-condition': ['当前胜利条件: 完成 AC6 (解锁 ', AText('A 能量'), ').'],

    'pU11.description': ['每秒获得 1 个', pointText('点数'), '.'],
    'pU12.description': ['将获得的', pointText('点数'), ' ×3.'],
    'pU13.description': ['基于当前', pointText('点数'),
                         ', 提高获得的', pointText('点数'), '.'],
    'pU13.hidden-description': '×(1+log10(点数))',
    'pU14.description': '解锁可重复购买升级 pB1.',
    'pU15.description': ['解锁 1 级', pointText('加速器'), '与 pB2.'],
    'pU21.description': ['解锁 pB0, 并将获得的', pointText('点数'), ' ×10.'],
    'pU22.description': [
        '解锁 2 级', pointText('加速器'),
        '与 pB3, 并将获得的', pointText('点数'), '×10.'],
    'pU23.description': [
        '解锁 3 级', pointText('加速器'),
        '与 pB4, 并将获得的', pointText('点数'), '×100.'],
    'pU24.description': ['将获得的', pointText('点数'), ' ×1e6.'],
    'pU25.description': '解锁一个新的重置层级.',
    'pU25.description-after-unlock': ['解锁 ', AText('A'), '.'],

    'Point.booster-amount-description': [
        '你当前有 ', pointText(param('amount')), ' 个 ',
        param('level'), ' 级', pointText('加速器'), '.'],

    'pB1.description': ['将获得的', pointText('点数'), ' ×', param('mult'), '.'],
    'pB2.description': ['将获得的 1 级', pointText('加速器'), ' ×', param('mult'), '.'],
    'pB3.description': ['将获得的 2 级', pointText('加速器'), ' ×', param('mult'), '.'],
    'pB4.description': ['将获得的 3 级', pointText('加速器'), ' ×', param('mult'), '.'],
    'pB0.description': [
        '将获得的', pointText('点数'), '与所有', pointText('加速器'), ' ×', param('mult'), '.'],

    'effect.simple-add': small(['当前效果: +', param('effect')]),
    'effect.simple-mul': small(['当前效果: ×', param('effect')]),

    'price.point': small(['价格: ', param('price'), ' ', pointText('点数'), '.']),
    'price.point-buyable': small(small([
        '价格 (', param('count'), '): ', param('price'), ' ', pointText('点数'), '.'])),

    'hotkey.should-alnum': '快捷键必须为数字或字母.',
    'hotkey.occupied': ['当前快捷键已被占用: ', param('target'), ', 是否强制设置?'],
    'hotkey.none': '无',
    'hotkey.hold-trigger': '触发快捷键功能',
    'hotkey.normal': ['快捷键 (', param('description'), '): '],
    'hotkey.wait': '按下任意数字或字母设置快捷键',

    'hotkey.point-buyable': ['购买所有 pB (', pointText('点数'), '可重复购买升级)'],

    'hint.hold-shift': '部分按钮可以通过长按 Shift 或 Ctrl 以查看未显示的额外信息.',

    'settings.confirm': '确认',
    'settings.cancel': '取消',
    'settings.manual-autosave': '手动触发自动保存',
    'settings.save': '存档',
    'settings.load': '读档',
    'settings.delete': '删除',
    'settings.new': '新建',
    'settings.export': '导出存档',
    'settings.export.success': '存档已成功导出到剪贴板!',
    'settings.export.failure': '无法将存档导出到剪贴板.',
    'settings.import': '导入存档',
    'settings.import.wrong-format': '无法识别存档格式!',
    'settings.import.parse-error': '导入存档时发生错误!',
    'settings.import.success': '存档导入成功!',
    'settings.save-load': '存档/读档',
    'settings.save-load.should-select-slot': '请先选择存档栏位.',
    'settings.save.success': ['成功保存到栏位 ', param('slot')],
    'settings.save.failure': ['保存到栏位 ', param('slot'), ' 失败.'],
    'settings.load.success': ['成功读取栏位 ', param('slot')],
    'settings.load.failure': ['读取栏位 ', param('slot'), ' 失败.'],
    'settings.delete.confirm': ['确认删除栏位 ', param('slot'), ' 吗?'],
    'settings.delete.success': ['成功删除栏位 ', param('slot')],
    'settings.new.instruction': '请输入新栏位名称.',
    'settings.new.illegal-name': '该名称含有非法字符, 请重新输入.',
    'settings.new.success': '添加新栏位成功!',
    'settings.full-reset': '硬重置存档',
    'settings.full-reset.confirm': ['请完整输入 \'', param('str'), '\' 以确认重置.'],
    'settings.full-reset.wrong-confirm': '输入文本错误, 请重试.',

    'stats.historical': '历史总数据',
    'stats.point.gameTime': ['当前游玩时间: ', param('point.gameTime')],
    'stats.point.points': ['最高', pointText('点数'), ': ', pointText(param('point.points'))],

    'tab-group.A': AText('A'),
    'tab-group.Achievements': '成就',
    'tab.A': AText('A'),
    'tab.A.challenge': AText('挑战'),
    'tab.Achievements': '成就',

    'A.amount': ['你当前有 ', AText(large(param('amount'))), ' 个 ', AText('A'), '.'],
    'A.reset-time': ['你进行了 ', AText(param('times')), ' 次 ', AText('A'), ' 重置.'],
    'A.reset.description': [
        '进行 ', AText('A'), ' 重置, 获得 ',
        AText(param('points')), ' 个 ', AText('A'), '.'],
    'A.reset.description-not-unlocked': [
        '需要 ', new OmegaNum("1e80"), ' ', pointText('点数'), '.'],
    'A.reset.hidden-description': small([
        '获得 ', AText(param('points')), ' 个 ', AText('A'), ',', br(),
        '获得 ', AText(param('times')), ' 次 ', AText('A'), ' 重置次数.']),

    'AU11.description': ['依据已经游玩的时间, 大幅提高', pointText('点数'), '获取.'],
    'AU11.hidden-description': '×(1+log10(时间))^3',
    'AU12.description': [
        '依据重置 ', AText('A'), ' 的次数, 提高获得的',
        pointText('点数'), '与所有', pointText('推进器'), '.'],
    'AU12.hidden-description': '×(1+A重置次数)',
    'AU13.description': [
        '基于未使用的 ', AText('A'), ', 提高获得的',
        pointText('点数'), '与所有', pointText('推进器'), '.'],
    'AU13.hidden-description': '×(1+log10(1+A))^3',
    'AU14.description': ['解锁 pU31. 此外, 在', pointText('点数'),
                         '足够时, 自动免费解锁', pointText('点数'), '升级.'],
    'AU15.description': ['永久解锁购买所有', pointText('推进器'),
                         '的快捷键. 推荐尽早购买以保护鼠标左键耐久度.'],
    'AU21.description': '解锁 pU32.',
    'AU22.description': ['解锁 ', AText('A 挑战'), '.'],
    'AU23.description': ['根据获得的成就数量, 提高获得的', pointText('点数'), '与所有', pointText('推进器'), '.'],
    'AU23.hidden-description': ['×成就数^3'],
    'AU24.description': ['削弱 pB 价格在 1.798e308 后的二阶增幅.'],
    'AU24.hidden-description': ['×0.5', br(), '按住 Shift 并悬停鼠标可查看详细说明.'],
    'AU24.hidden-tooltip': [
        '令 P0 表示初始价格, R0 表示价格增幅. 在软上限前, 已购买 n 次时, 价格为 P0 × R0^n.', br(),
        '令 P1 为软上限, 这里是 1.798e308. 令 R1 为二阶价格增幅. 令 T1 为临界次数, 满足 P1 = P0 × R0^T1.', br(),
        '则软上限后, 已购买 T1 + n 次时, 价格为 P1 × R0^n × R1^(n^2/2), 大致相当于每次购买后, 价格增幅乘以 R1.',
    ],
    'AU25.description': ['进一步削弱 pB 价格在 1.798e308 后的二阶增幅.'],
    'AU25.hidden-description': ['×0.4'],

    'AB1.description': ['将获得的 ', AText('A'), ' ×2.'],
    'AB2.description': ['将', pointText('点数'), '升级 pB1 的倍数 ×1.02.'],

    'pU31.description': [
        '解锁 4 级', pointText('加速器'),
        '与 pB5, 并将获得的', pointText('点数'), '×1000.'],
    'pU32.description': [
        '解锁 5 级', pointText('加速器'),
        '与 pB6, 并将获得的', pointText('点数'), '×1e5.'],
    'pB5.description': ['将获得的 4 级', pointText('加速器'), ' ×', param('mult'), '.'],
    'pB6.description': ['将获得的 5 级', pointText('加速器'), ' ×', param('mult'), '.'],

    'price.A': small(['价格: ', param('price'), ' ', AText('A'), '.']),
    'price.A-buyable': small([
        '价格 (', param('count'), '): ', param('price'), ' ', AText('A'), '.']),

    'stats.A': ['最近一次 ', AText('A'), ' 重置以来:'],
    'stats.A.resetTimes': ['进行 ', AText('A'), ' 重置次数: ', AText(param('A.resetTimes'))],
    'stats.A.points': ['最高 ', AText('A'), ' 数量: ', AText(param('A.points'))],
    'stats.A.pointsOnReset': ['单次重置获得的最高 ', AText('A'), ' 数量: ', AText(param('A.pointsOnReset'))],
    'stats.A.resetDuration': ['最快 ', AText('A'), ' 重置用时: ', AText(param('A.resetDuration'))],

    'hint.reset-A-twice': ['通过一次重置获得 1.1 ', AText('A'), ' 看起来非常困难 (耗时). ',
                           '然而, 若愿意进行两次重置, 则事情就简单许多, 但需要更多手动操作. ',
                           '如何选择呢?'],
    'hint.point-buyable-scaling': ['当', pointText('推进器'), '的价格到达 ',
                                   new OmegaNum(Number.MAX_VALUE), ' 后, 将会进行价格折算. ',
                                   '之前, 每次购买后价格提高的倍数相同. 此后, 每次购买后的价格增量也会提高.'],
    'hint.challenge-qol-effect': ['有些挑战的奖励是推进进度必需的, ',
                                  '有些则是减少点击次数的 QoL 功能. ', br(),
                                  '可根据奖励与完成难度来决策何时完成挑战.'],

    'hotkey.A-reset': ['进行 ', AText('A'), ' 重置'],

    'achievement.new': ['获得成就 ', param('name'), '!'],
    'achievement.amount': ['你已经获得了 ', param('amount'), ' 个成就.'],

    'Ach11.description': ['开始获得', pointText('点数'), '.'],
    'Ach12.description': ['获得 100 ', pointText('点数'), '.'],
    'Ach13.description': ['获得 1e10 ', pointText('点数'), '.'],
    'Ach14.description': ['获得 1e50 ', pointText('点数'), '.'],
    'Ach15.description': ['获得 1e80 ', pointText('点数'), '.'],
    'Ach16.description': ['获得 1e100 ', pointText('点数'), '.'],
    'Ach17.description': ['获得 1e160 ', pointText('点数'), '.'],
    'Ach18.description': ['获得 ', new OmegaNum(Number.MAX_VALUE), ' ', pointText('点数'), '.'],
    'Ach21.description': ['解锁', pointText('推进器'), '.'],
    'Ach22.description': ['解锁 2 级', pointText('推进器'), '.'],
    'Ach23.description': ['解锁 3 级', pointText('推进器'), '.'],
    'Ach24.description': ['获得 1e50 个', pointText('推进器'), '.'],
    'Ach25.description': ['获得 1e100 个 2 级', pointText('推进器'), '.'],
    'Ach26.description': ['解锁 4 级', pointText('推进器'), '.'],
    'Ach27.description': ['解锁 5 级', pointText('推进器'), '.'],
    'Ach28.description': ['获得 1e25 个 5 级', pointText('推进器'), '.'],
    'Ach31.description': ['进行 ', AText('A'), '重置.'],
    'Ach32.description': ['拥有 1000 ', AText('A'), '.'],
    'Ach33.description': ['完成 1 个 ', AText('A'), ' 挑战.'],
    'Ach34.description': ['完成 2 个 ', AText('A'), ' 挑战.'],
    'Ach35.description': ['完成 3 个 ', AText('A'), ' 挑战.'],
    'Ach36.description': ['完成 4 个 ', AText('A'), ' 挑战.'],
    'Ach37.description': ['完成 5 个 ', AText('A'), ' 挑战.'],
    'Ach38.description': ['完成 6 个 ', AText('A'), ' 挑战.'],
    'Ach41.description': ['获得 1e350 ', pointText('点数'), '.'],
    'Ach42.description': ['一次重置获得 10 ', AText('A'), '.'],
    'Ach43.description': ['获得 1e450 ', pointText('点数'), '.'],
    'Ach44.description': ['一次重置获得 100 ', AText('A'), '.'],
    'Ach45.description': ['获得 1e600 ', pointText('点数'), '.'],
    'Ach46.description': ['一次重置获得 1000 ', AText('A'), '.'],
    'Ach47.description': ['获得 1e1000 ', pointText('点数'), '.'],
    'Ach48.description': ['一次重置获得 1e5 ', AText('A'), '.'],

    'challenge.start-not-unlocked': '未解锁',

    'A.reset.challenge.not-unlocked': ['需要 ', param('target'), ' ',
                                       pointText('点数'), '以完成挑战.'],
    'A.reset.challenge.can-complete': ['进行 ', AText('A'), ' 重置, 并完成挑战.'],

    'A.challenge.instruction': [
        '进入任何挑战时将强制进行 ', AText('A'), ' 重置. ',
        '在挑战中, 进行 ', AText('A'), ' 重置以完成挑战.', br(),
        '挑战中, 重置所需', pointText('点数'), '会发生变化. ',
        '部分挑战中, ', pointText('点数'), '以获胜条件为上限.', br(),
        '若挑战无法在可接受的时间内完成, 可能说明需要购买更多升级后再来.', br(),
        '挑战的难度并不沿编号递增.',
    ],
    'A.challenge.no-running': ['当前没有正在进行的 ', AText('A 挑战'), '.'],
    'A.challenge.running': ['当前正在进行: ', param('running')],
    'A.challenge.start': ['开始', AText('挑战')],
    'A.challenge.exit': ['退出', AText('挑战')],
    'A.challenge.exit-confirm': '确认退出吗?',
    'A.challenge.completed': ['已完成'],
    'A.challenge.target': ['目标: ', param('target-point'), '点数.'],

    'AC1.description': '只是一个普通的挑战.',
    'AC1.effect': ['解锁 ', AText('A'), ' 升级 AB1.'],
    'AC2.description': '另一个普通的挑战.',
    'AC2.effect': ['解锁', pointText('点数'), '升级 pB 的购买最大模式 (目前使用快捷键购买自动生效; 切换/鼠标购买 TODO).'],
    'AC3.description': '还是一个普通的挑战.',
    'AC3.effect': ['解锁', pointText('点数'), '升级 pB 的自动购买器 (NYI).'],
    'AC4.description': '将 pB0 的加成倍数固定为 1.05, 无视任何升级.',
    'AC4.effect': ['解锁 ', AText('A'), ' 升级 AB2.'],
    'AC5.description': '将 pB1-6 的加成倍数固定为 1.6, 无视任何升级.',
    'AC5.effect': ['将 pB1-6 的加成倍数提高到至少 2.2.'],
    'AC6.description': '禁用 pU31 与 pU32.',
    'AC6.effect': ['解锁 ', AText('A 能量'), ' (TODO).'],

    'settings.show.on': '显示',
    'settings.show.off': '隐藏',
    'settings.save.confirm': '确定要覆盖存档吗?',
    'settings.load.confirm': '确定要读取存档吗?',

    'hint.info': ['本游戏由笑姐姐制作, 缝合了 (或将来希望缝合) 包括反物质维度 (Antimatter Dimensions), ',
                  '质量增量 (Incremental Mass Rewritten) 在内的多款增量游戏的部分机制和少量 UI 设计.', br(),
                  '最近更新: 20250730'],

    'hint.mobile': '若你在移动端访问, 可在设置页中给底部悬浮按钮设置快捷键.',
    'hint.manual-save': ['尽管有自动存档, 还是建议每次退出时手动存档. ',
                         '以作者的低技术力, 万一以后某一次更新把读档功能 (包括读取自动存档) 搞炸了, ',
                         '自动存档就无法恢复了; 而手动存档在 bug 修好后就能正确读取了.'],

    'settings.virtual.show': ['虚拟快捷键: ', param('show')],
    'settings.virtual': '设置虚拟快捷键',
    'settings.virtual.input': '请输入至多三个数字或字母, 以设置虚拟快捷键.',

    'tab-group.Hint': '提示信息',
    'tab.Hint': '提示',

    'hint-tab.instruction': '此处收录所有出现过的提示信息.',
} satisfies Record<string, PFormattedText>;

export const text_zh: Record<TextId, PFormattedText> = text_zh_impl;