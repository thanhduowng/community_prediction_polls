// Copyright (c) 2024 IOTA Stiftung
// SPDX-License-Identifier: Apache-2.0

/// Community Prediction Polls - Yes/No predictions with simple stats
/// 
/// Mô tả: Hệ thống tạo poll dự đoán đơn giản với 2 lựa chọn YES/NO
/// 
/// Tính năng:
/// - Bất kỳ ai cũng có thể tạo poll mới
/// - Người dùng (trừ creator) có thể vote YES hoặc NO
/// - Mỗi địa chỉ chỉ được vote 1 lần cho mỗi poll
/// - Theo dõi số lượng vote YES, NO và tổng số vote
module community_prediction_polls::contract {
    use std::string::{Self, String};
    use iota::table::{Self, Table};
    use iota::event;

    // ===== Error codes - Mã lỗi =====
    
    /// Lỗi: Creator không thể vote cho poll của chính mình
    const E_CREATOR_CANNOT_VOTE: u64 = 0;
    /// Lỗi: Địa chỉ này đã vote rồi
    const E_ALREADY_VOTED: u64 = 1;
    /// Lỗi: Lựa chọn vote không hợp lệ (chỉ 0 = YES hoặc 1 = NO)
    const E_INVALID_CHOICE: u64 = 2;

    // ===== Constants - Hằng số =====
    
    /// Lựa chọn YES
    const VOTE_YES: u8 = 0;
    /// Lựa chọn NO
    const VOTE_NO: u8 = 1;

    // ===== Structs - Cấu trúc dữ liệu =====

    /// Poll - Cấu trúc lưu trữ thông tin một poll
    /// Đây là shared object, ai cũng có thể truy cập
    public struct Poll has key {
        /// ID duy nhất của poll
        id: UID,
        /// Địa chỉ người tạo poll
        creator: address,
        /// Tiêu đề của poll
        title: String,
        /// Mô tả chi tiết của poll
        description: String,
        /// Số lượng vote YES
        yes_count: u64,
        /// Số lượng vote NO
        no_count: u64,
        /// Tổng số vote
        total_votes: u64,
        /// Bảng lưu các địa chỉ đã vote (address -> đã vote hay chưa)
        voters: Table<address, bool>
    }

    // ===== Events - Sự kiện =====

    /// Event được emit khi tạo poll mới
    public struct PollCreated has copy, drop {
        poll_id: ID,
        creator: address,
        title: String,
        description: String,
    }

    /// Event được emit khi có vote mới
    public struct VoteCast has copy, drop {
        poll_id: ID,
        voter: address,
        choice: u8,
        yes_count: u64,
        no_count: u64,
    }

    // ===== Public Functions - Các hàm công khai =====

    /// Tạo poll mới
    /// 
    /// # Arguments
    /// * `title` - Tiêu đề của poll (dạng bytes, sẽ convert sang String)
    /// * `description` - Mô tả của poll (dạng bytes, sẽ convert sang String)
    /// * `ctx` - Transaction context
    /// 
    /// # Example
    /// ```
    /// iota client call --package <PACKAGE_ID> --module contract --function create_poll \
    ///   --args "My Poll Title" "This is the description"
    /// ```
    public fun create_poll(
        title: vector<u8>,
        description: vector<u8>,
        ctx: &mut TxContext
    ) {
        let poll_uid = object::new(ctx);
        let poll_id = object::uid_to_inner(&poll_uid);
        
        // Tạo poll mới với các giá trị khởi tạo
        let poll = Poll {
            id: poll_uid,
            creator: ctx.sender(),
            title: string::utf8(title),
            description: string::utf8(description),
            yes_count: 0,
            no_count: 0,
            total_votes: 0,
            voters: table::new(ctx)
        };
        
        // Emit event để track poll mới
        event::emit(PollCreated {
            poll_id,
            creator: ctx.sender(),
            title: string::utf8(title),
            description: string::utf8(description),
        });
        
        // Share object để mọi người có thể truy cập và vote
        transfer::share_object(poll);
    }

    /// Vote cho một poll
    /// 
    /// # Arguments
    /// * `poll` - Reference đến poll cần vote
    /// * `choice` - Lựa chọn vote: 0 = YES, 1 = NO
    /// * `ctx` - Transaction context
    /// 
    /// # Lỗi có thể xảy ra
    /// * E_CREATOR_CANNOT_VOTE - Nếu creator cố vote cho poll của mình
    /// * E_ALREADY_VOTED - Nếu địa chỉ này đã vote rồi
    /// * E_INVALID_CHOICE - Nếu choice không phải 0 hoặc 1
    /// 
    /// # Example
    /// ```
    /// # Vote YES (choice = 0)
    /// iota client call --package <PACKAGE_ID> --module contract --function vote \
    ///   --args <POLL_ID> 0
    /// 
    /// # Vote NO (choice = 1)
    /// iota client call --package <PACKAGE_ID> --module contract --function vote \
    ///   --args <POLL_ID> 1
    /// ```
    public fun vote(
        poll: &mut Poll,
        choice: u8,
        ctx: &TxContext
    ) {
        let voter = ctx.sender();
        
        // Kiểm tra: Creator không thể vote cho poll của chính mình
        assert!(voter != poll.creator, E_CREATOR_CANNOT_VOTE);
        
        // Kiểm tra: Địa chỉ này chưa vote
        assert!(!table::contains(&poll.voters, voter), E_ALREADY_VOTED);
        
        // Kiểm tra: Lựa chọn hợp lệ (0 = YES, 1 = NO)
        assert!(choice == VOTE_YES || choice == VOTE_NO, E_INVALID_CHOICE);
        
        // Ghi nhận vote
        if (choice == VOTE_YES) {
            poll.yes_count = poll.yes_count + 1;
        } else {
            poll.no_count = poll.no_count + 1;
        };
        
        // Tăng tổng số vote
        poll.total_votes = poll.total_votes + 1;
        
        // Đánh dấu địa chỉ này đã vote
        table::add(&mut poll.voters, voter, true);
        
        // Emit event
        event::emit(VoteCast {
            poll_id: object::id(poll),
            voter,
            choice,
            yes_count: poll.yes_count,
            no_count: poll.no_count,
        });
    }

    // ===== View Functions - Các hàm đọc dữ liệu =====

    /// Lấy tiêu đề của poll
    public fun get_title(poll: &Poll): &String {
        &poll.title
    }

    /// Lấy mô tả của poll
    public fun get_description(poll: &Poll): &String {
        &poll.description
    }

    /// Lấy số lượng vote YES
    public fun get_yes_count(poll: &Poll): u64 {
        poll.yes_count
    }

    /// Lấy số lượng vote NO
    public fun get_no_count(poll: &Poll): u64 {
        poll.no_count
    }

    /// Lấy tổng số vote
    public fun get_total_votes(poll: &Poll): u64 {
        poll.total_votes
    }

    /// Lấy địa chỉ người tạo poll
    public fun get_creator(poll: &Poll): address {
        poll.creator
    }

    /// Kiểm tra xem một địa chỉ đã vote chưa
    public fun has_voted(poll: &Poll, voter: address): bool {
        table::contains(&poll.voters, voter)
    }

    /// Lấy tất cả thông tin của poll
    /// Trả về: (title, description, yes_count, no_count, total_votes, creator)
    public fun get_poll_info(poll: &Poll): (&String, &String, u64, u64, u64, address) {
        (
            &poll.title,
            &poll.description,
            poll.yes_count,
            poll.no_count,
            poll.total_votes,
            poll.creator
        )
    }
}

